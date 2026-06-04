"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  created_at: string;
  bytes: number;
  format: string;
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  createdAt: string;
}

const ROLES = ["student", "tutor", "admin"] as const;

const ROLE_STYLE: Record<string, string> = {
  admin: "border-red-500/30 bg-red-500/20 text-red-400",
  tutor: "border-blue-500/30 bg-blue-500/20 text-blue-400",
  student: "border-emerald-500/30 bg-emerald-500/20 text-emerald-400",
};

export default function AdminDashboard() {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const loadImages = async () => {
    setImagesLoading(true);
    try {
      const res = await fetch("/api/admin/images");
      const data = await res.json();
      if (res.ok) setImages(data.images);
      else toast.error(data.error ?? "Failed to load images");
    } catch {
      toast.error("Failed to load images");
    } finally {
      setImagesLoading(false);
    }
  };

  const loadUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) setUsers(data.users);
      else toast.error(data.error ?? "Failed to load users");
    } catch {
      toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
    loadUsers();
  }, []);

  const deleteImage = async (publicId: string) => {
    try {
      const res = await fetch(`/api/admin/images?publicId=${encodeURIComponent(publicId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setImages((prev) => prev.filter((img) => img.public_id !== publicId));
        toast.success("Image deleted");
      } else {
        toast.error("Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const updateRole = async (id: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role: role as AdminUser["role"] } : u))
        );
        toast.success("Role updated");
      } else {
        toast.error("Update failed");
      }
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id));
        toast.success("User deleted");
      } else {
        toast.error(data.error ?? "Delete failed");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="container py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold md:text-4xl">Admin Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage images and users.</p>
      </header>

      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Images ({images.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        </TabsList>

        {/* ── Images ── */}
        <TabsContent value="images" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Uploaded Images</h2>
            <Button variant="outline" size="sm" onClick={loadImages} disabled={imagesLoading}>
              <RefreshCw className={cn("h-4 w-4", imagesLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {imagesLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : images.length === 0 ? (
            <p className="text-muted-foreground">No images uploaded yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((img) => (
                <div key={img.public_id} className="group relative overflow-hidden rounded-lg border">
                  <img src={img.secure_url} alt="" className="h-40 w-full object-cover" />
                  <div className="p-2">
                    <p className="truncate text-xs text-muted-foreground">{img.public_id}</p>
                    <p className="text-xs text-muted-foreground">
                      {(img.bytes / 1024).toFixed(1)} KB · {img.format.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => deleteImage(img.public_id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Users ── */}
        <TabsContent value="users" className="mt-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Users</h2>
            <Button variant="outline" size="sm" onClick={loadUsers} disabled={usersLoading}>
              <RefreshCw className={cn("h-4 w-4", usersLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>

          {usersLoading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Role</th>
                    <th className="px-4 py-3 text-left font-medium">Joined</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user._id} className="transition-colors hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded border px-2 py-0.5 text-xs font-medium",
                            ROLE_STYLE[user.role] ?? ROLE_STYLE.student
                          )}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user._id, e.target.value)}
                            className="rounded border border-border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => deleteUser(user._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
