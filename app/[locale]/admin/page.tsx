"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Images as ImagesIcon,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "admin";
  createdAt: string;
}

interface Problem {
  _id: string;
  statementKa: string;
  number: string;
  bookSlug: string;
  difficulty: "easy" | "medium" | "hard";
  status: "pending" | "approved" | "rejected";
  authorName?: string;
  createdAt: string;
}

interface TutorWithProfile {
  _id: string;
  name: string;
  email: string;
  profile: {
    _id: string;
    approved: boolean;
    bio?: string;
    subjects: string[];
    hourlyRateGEL: number;
    yearsExperience?: number;
    experience?: string;
    rejectionReason?: string;
  } | null;
}

interface Metrics {
  totalUsers: number;
  totalTutors: number;
  pendingProblems: number;
  totalProblems: number;
}

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  created_at: string;
  bytes: number;
  format: string;
}

const ROLE_BADGE: Record<string, "default" | "secondary" | "destructive" | "cool" | "outline"> = {
  admin: "destructive",
  tutor: "cool",
  student: "secondary",
};

const DIFF_COLOR: Record<string, string> = {
  easy: "text-emerald-500",
  medium: "text-amber-500",
  hard: "text-red-500",
};

const METRIC_TILES = [
  { key: "totalUsers" as const, label: "Total Users", icon: Users },
  { key: "totalTutors" as const, label: "Tutors", icon: GraduationCap },
  { key: "pendingProblems" as const, label: "Pending Problems", icon: FileText },
  { key: "totalProblems" as const, label: "Total Problems", icon: BarChart3 },
];

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tutors, setTutors] = useState<TutorWithProfile[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [tutorRejectionReason, setTutorRejectionReason] = useState<Record<string, string>>({});
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users ?? []);
  }, []);

  const fetchProblems = useCallback(async () => {
    const res = await fetch("/api/admin/problems?status=pending");
    const data = await res.json();
    setProblems(data.problems ?? []);
  }, []);

  const fetchTutors = useCallback(async () => {
    const res = await fetch("/api/admin/tutors");
    const data = await res.json();
    setTutors(data.tutors ?? []);
  }, []);

  const fetchMetrics = useCallback(async () => {
    const res = await fetch("/api/admin/metrics");
    const data = await res.json();
    setMetrics(data);
  }, []);

  const loadImages = useCallback(async () => {
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
  }, []);

  const refresh = useCallback(() => {
    fetchUsers();
    fetchProblems();
    fetchTutors();
    fetchMetrics();
    loadImages();
  }, [fetchUsers, fetchProblems, fetchTutors, fetchMetrics, loadImages]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function changeRole(userId: string, role: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    refresh();
  }

  async function deleteUser(userId: string) {
    if (!confirm("Permanently delete this user?")) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    refresh();
  }

  async function reviewProblem(problemId: string, status: "approved" | "rejected") {
    await fetch(`/api/admin/problems/${problemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejectionReason: rejectionReason[problemId] }),
    });
    fetchProblems();
    fetchMetrics();
  }

  async function setTutorProfileApproved(tutorId: string, approved: boolean) {
    await fetch(`/api/admin/tutors/${tutorId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approved,
        rejectionReason: approved ? undefined : tutorRejectionReason[tutorId],
      }),
    });
    fetchTutors();
  }

  async function deleteImage(publicId: string) {
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
  }

  return (
    <div className="container max-w-7xl space-y-8 py-10">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary backdrop-blur">
          Gradebook
        </div>
        <h1 className="text-balance font-serif text-3xl font-bold tracking-tight md:text-4xl">
          <span className="text-gradient-cool">Admin Panel</span>
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage users, tutors, problems, and platform health.
        </p>
      </header>

      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" /> Metrics
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Users
            {users.length > 0 && (
              <span className="ml-0.5 rounded-full bg-muted px-1.5 py-0 text-xs">{users.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tutors" className="flex items-center gap-1.5">
            <GraduationCap className="h-4 w-4" /> Tutors
            {tutors.length > 0 && (
              <span className="ml-0.5 rounded-full bg-muted px-1.5 py-0 text-xs">{tutors.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" /> Problems
            {problems.length > 0 && (
              <span className="ml-0.5 rounded-full bg-destructive/80 px-1.5 py-0 text-xs text-destructive-foreground">
                {problems.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-1.5">
            <ImagesIcon className="h-4 w-4" /> Images
          </TabsTrigger>
        </TabsList>

        {/* METRICS */}
        <TabsContent value="metrics" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRIC_TILES.map(({ key, label, icon: Icon }) => (
              <Card key={key}>
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-teal-500/15 to-emerald-500/15 text-primary ring-1 ring-inset ring-teal-500/20">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {label}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{metrics?.[key] ?? "—"}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">All Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dashed border-border text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-border">
                    {users.map((u) => (
                      <tr key={u._id} className="transition-colors hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={ROLE_BADGE[u.role] ?? "secondary"}>{u.role}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-1">
                            {(["student", "tutor", "admin"] as const)
                              .filter((r) => r !== u.role)
                              .map((r) => (
                                <Button
                                  key={r}
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => changeRole(u._id, r)}
                                >
                                  {String.fromCharCode(8594)} {r}
                                </Button>
                              ))}
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-7 w-7 p-0"
                              onClick={() => deleteUser(u._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="py-10 text-center text-muted-foreground">No users found.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TUTORS */}
        <TabsContent value="tutors" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Tutors ({tutors.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-dashed border-border text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Subjects</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Rate (GEL)</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dashed divide-border">
                    {tutors.map((t) => {
                      const rejected = !t.profile?.approved && !!t.profile?.rejectionReason;
                      return (
                        <tr key={t._id} className="align-top transition-colors hover:bg-muted/30">
                          <td className="px-4 py-3 font-medium">{t.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{t.email}</td>
                          <td className="px-4 py-3">
                            {t.profile ? (
                              <div className="space-y-1">
                                <Badge
                                  variant={
                                    t.profile.approved
                                      ? "cool"
                                      : rejected
                                        ? "destructive"
                                        : "secondary"
                                  }
                                >
                                  {t.profile.approved
                                    ? "Approved"
                                    : rejected
                                      ? "Rejected"
                                      : "Pending"}
                                </Badge>
                                {rejected && (
                                  <p className="max-w-[180px] text-[11px] text-destructive">
                                    {t.profile.rejectionReason}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <Badge variant="outline">No profile</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.profile?.subjects.join(", ") || "—"}
                          </td>
                          <td
                            className="max-w-[220px] px-4 py-3 text-muted-foreground"
                            title={t.profile?.experience}
                          >
                            {t.profile?.yearsExperience !== undefined && (
                              <p className="text-xs font-medium text-foreground">
                                {t.profile.yearsExperience} yrs
                              </p>
                            )}
                            {t.profile?.experience && (
                              <p className="line-clamp-2 text-[11px]">{t.profile.experience}</p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {t.profile?.hourlyRateGEL ?? "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col items-start gap-1.5">
                              <div className="flex items-center gap-1">
                                {t.profile && !t.profile.approved && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 rounded-md border-dashed border-emerald-500/50 font-mono text-[11px] uppercase tracking-wide text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                                    onClick={() => setTutorProfileApproved(t._id, true)}
                                  >
                                    <CheckCircle className="mr-1 h-3 w-3" /> Approve
                                  </Button>
                                )}
                                {t.profile && !t.profile.approved && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 rounded-md border-dashed border-destructive/50 font-mono text-[11px] uppercase tracking-wide text-destructive hover:bg-destructive/10"
                                    onClick={() => setTutorProfileApproved(t._id, false)}
                                  >
                                    <XCircle className="mr-1 h-3 w-3" /> Reject
                                  </Button>
                                )}
                                {t.profile?.approved && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 rounded-md border-dashed border-destructive/50 font-mono text-[11px] uppercase tracking-wide text-destructive hover:bg-destructive/10"
                                    onClick={() => setTutorProfileApproved(t._id, false)}
                                  >
                                    <XCircle className="mr-1 h-3 w-3" /> Revoke
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                  onClick={() => changeRole(t._id, "student")}
                                >
                                  {String.fromCharCode(8594)} student
                                </Button>
                              </div>
                              {t.profile && !t.profile.approved && (
                                <Input
                                  placeholder="Rejection reason (optional)"
                                  className="h-7 w-48 text-[11px]"
                                  value={tutorRejectionReason[t._id] ?? ""}
                                  onChange={(e) =>
                                    setTutorRejectionReason((prev) => ({
                                      ...prev,
                                      [t._id]: e.target.value,
                                    }))
                                  }
                                />
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {tutors.length === 0 && (
                  <p className="py-10 text-center text-muted-foreground">No tutors yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PROBLEMS */}
        <TabsContent value="problems" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Pending Problems ({problems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {problems.map((p, i) => (
                  <div
                    key={p._id}
                    className={cn(
                      "space-y-3 rounded-lg border border-dashed border-border bg-card/60 p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md",
                      i % 2 === 0 ? "sm:-rotate-[0.3deg]" : "sm:rotate-[0.3deg]",
                    )}
                  >
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-medium">#{p.number}</span>
                        <Badge variant="outline" className="text-xs">
                          {p.bookSlug}
                        </Badge>
                        <span className={`text-xs font-medium ${DIFF_COLOR[p.difficulty]}`}>
                          {p.difficulty}
                        </span>
                        {p.authorName && (
                          <span className="text-xs text-muted-foreground">by {p.authorName}</span>
                        )}
                      </div>
                      <p className="line-clamp-3 text-sm text-muted-foreground">{p.statementKa}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Rejection reason (optional)"
                        className="h-8 text-xs"
                        value={rejectionReason[p._id] ?? ""}
                        onChange={(e) =>
                          setRejectionReason((prev) => ({ ...prev, [p._id]: e.target.value }))
                        }
                      />
                      <Button
                        size="sm"
                        className="h-8 shrink-0 rounded-md border-2 border-dashed border-emerald-600 bg-transparent font-mono text-xs uppercase tracking-wide text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                        onClick={() => reviewProblem(p._id, "approved")}
                      >
                        <CheckCircle className="mr-1 h-3 w-3" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 shrink-0 rounded-md border-2 border-dashed border-destructive bg-transparent font-mono text-xs uppercase tracking-wide text-destructive hover:bg-destructive/10"
                        onClick={() => reviewProblem(p._id, "rejected")}
                      >
                        <XCircle className="mr-1 h-3 w-3" /> Reject
                      </Button>
                    </div>
                  </div>
                ))}
                {problems.length === 0 && (
                  <p className="py-8 text-center text-muted-foreground">No pending problems.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMAGES */}
        <TabsContent value="images" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="font-serif">Uploaded Images ({images.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={loadImages} disabled={imagesLoading}>
                <RefreshCw className={cn("h-4 w-4", imagesLoading && "animate-spin")} />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {imagesLoading ? (
                <p className="text-muted-foreground">Loading…</p>
              ) : images.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No images uploaded yet.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {images.map((img) => (
                    <div
                      key={img.public_id}
                      className="group relative overflow-hidden rounded-lg border border-border"
                    >
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
