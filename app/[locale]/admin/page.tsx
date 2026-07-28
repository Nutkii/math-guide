"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  Trash2,
  CheckCircle,
  XCircle,
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

const ROLE_BADGE: Record<string, "default" | "secondary" | "destructive" | "cool" | "outline"> = {
  admin: "destructive",
  tutor: "cool",
  student: "secondary",
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [tutors, setTutors] = useState<TutorWithProfile[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [rejectionReason, setRejectionReason] = useState<Record<string, string>>({});
  const [tutorRejectionReason, setTutorRejectionReason] = useState<Record<string, string>>({});

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

  const refresh = useCallback(() => {
    fetchUsers();
    fetchProblems();
    fetchTutors();
    fetchMetrics();
  }, [fetchUsers, fetchProblems, fetchTutors, fetchMetrics]);

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

  const DIFF_COLOR: Record<string, string> = {
    easy: "text-emerald-500",
    medium: "text-amber-500",
    hard: "text-red-500",
  };

  return (
    <div className="container max-w-7xl py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage users, tutors, problems, and platform health.
        </p>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" /> Metrics
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Users
            {users.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0 text-xs">{users.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="tutors" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" /> Tutors
            {tutors.length > 0 && (
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0 text-xs">{tutors.length}</span>
            )}
          </TabsTrigger>
          <TabsTrigger value="problems" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> Problems
            {problems.length > 0 && (
              <span className="ml-1 rounded-full bg-destructive/80 text-destructive-foreground px-1.5 py-0 text-xs">
                {problems.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* METRICS */}
        <TabsContent value="metrics" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Users", value: metrics?.totalUsers },
              { label: "Tutors", value: metrics?.totalTutors },
              { label: "Pending Problems", value: metrics?.pendingProblems },
              { label: "Total Problems", value: metrics?.totalProblems },
            ].map((m) => (
              <Card key={m.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {m.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{m.value ?? "—"}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* USERS */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Users ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Joined</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge variant={ROLE_BADGE[u.role] ?? "secondary"}>{u.role}</Badge>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
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
              <CardTitle>Tutors ({tutors.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Subjects</th>
                      <th className="px-4 py-3">Experience</th>
                      <th className="px-4 py-3">Rate (GEL)</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {tutors.map((t) => {
                      const rejected = !t.profile?.approved && !!t.profile?.rejectionReason;
                      return (
                        <tr key={t._id} className="hover:bg-muted/30 transition-colors align-top">
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
                            className="px-4 py-3 text-muted-foreground max-w-[220px]"
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
                                    className="h-7 text-xs text-emerald-500 border-emerald-500/40 hover:bg-emerald-500/10"
                                    onClick={() => setTutorProfileApproved(t._id, true)}
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" /> Approve
                                  </Button>
                                )}
                                {t.profile && !t.profile.approved && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                                    onClick={() => setTutorProfileApproved(t._id, false)}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" /> Reject
                                  </Button>
                                )}
                                {t.profile?.approved && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs text-destructive border-destructive/40 hover:bg-destructive/10"
                                    onClick={() => setTutorProfileApproved(t._id, false)}
                                  >
                                    <XCircle className="h-3 w-3 mr-1" /> Revoke
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
              <CardTitle>Pending Problems ({problems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {problems.map((p) => (
                  <div key={p._id} className="rounded-lg border p-4 space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-medium text-sm">#{p.number}</span>
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
                      <p className="text-sm text-muted-foreground line-clamp-3">{p.statementKa}</p>
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
                        className="h-8 shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => reviewProblem(p._id, "approved")}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 shrink-0"
                        onClick={() => reviewProblem(p._id, "rejected")}
                      >
                        <XCircle className="h-3 w-3 mr-1" /> Reject
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
      </Tabs>
    </div>
  );
}
