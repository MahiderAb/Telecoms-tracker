"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Star,
  Settings,
  Plus,
  ListTodo,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Calendar,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import type { Project, Issue, User } from "@/lib/types";

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-3/20 text-chart-3",
  high: "bg-chart-5/20 text-chart-5",
  critical: "bg-destructive/20 text-destructive",
};

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-chart-2/20 text-chart-2",
  review: "bg-chart-4/20 text-chart-4",
  done: "bg-primary/20 text-primary",
};

const statusLabels = {
  todo: "Todo",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projectRes, issuesRes, usersRes] = await Promise.all([
          fetch(`/api/projects/${id}`),
          fetch(`/api/issues?projectId=${id}`),
          fetch("/api/users"),
        ]);

        if (projectRes.ok) {
          const projectData = await projectRes.json();
          setProject(projectData);
          setIsStarred(projectData.starred || false);
        }

        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          setIssues(issuesData);
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Failed to fetch project data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const getUserById = (userId: string) =>
    users.find((u) => u.id === userId);

  const issuesByStatus = {
    todo: issues.filter((i) => i.status === "todo"),
    "in-progress": issues.filter((i) => i.status === "in-progress"),
    review: issues.filter((i) => i.status === "review"),
    done: issues.filter((i) => i.status === "done"),
  };

  const completionRate =
    issues.length > 0
      ? Math.round((issuesByStatus.done.length / issues.length) * 100)
      : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Project not found</p>
          <Link href="/projects">
            <Button variant="outline">Back to Projects</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${project.color}`}
              >
                <span className="text-lg font-bold text-primary-foreground">
                  {project.tag.slice(0, 2)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-foreground">
                    {project.name}
                  </h1>
                  <Badge variant="outline">{project.tag}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star
                className={`h-4 w-4 ${
                  isStarred ? "fill-chart-3 text-chart-3" : ""
                }`}
              />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <Link href="/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <ListTodo className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{issuesByStatus.todo.length}</p>
                <p className="text-sm text-muted-foreground">Todo</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Clock className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {issuesByStatus["in-progress"].length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <AlertCircle className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-2xl font-bold">{issuesByStatus.review.length}</p>
                <p className="text-sm text-muted-foreground">In Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{issuesByStatus.done.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Project Progress</span>
              <span className="text-sm text-muted-foreground">
                {completionRate}% Complete
              </span>
            </div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="issues" className="w-full">
          <TabsList>
            <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="issues" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-4">
              {(["todo", "in-progress", "review", "done"] as const).map(
                (status) => (
                  <div key={status} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium flex items-center gap-2">
                        <Badge variant="outline" className={statusColors[status]}>
                          {statusLabels[status]}
                        </Badge>
                        <span className="text-muted-foreground">
                          ({issuesByStatus[status].length})
                        </span>
                      </h3>
                    </div>
                    <div className="space-y-2">
                      {issuesByStatus[status].map((issue) => {
                        const assignee = getUserById(issue.assigneeId);
                        return (
                          <Link
                            key={issue.id}
                            href={`/issues/${issue.id}`}
                          >
                            <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {issue.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {issue.id}
                                    </p>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={priorityColors[issue.priority]}
                                  >
                                    {issue.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                  {assignee && (
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={assignee.avatar} />
                                      <AvatarFallback className="text-xs">
                                        {assignee.name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })}
                      {issuesByStatus[status].length === 0 && (
                        <div className="rounded-lg border border-dashed p-4 text-center">
                          <p className="text-xs text-muted-foreground">
                            No issues
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {users.slice(0, 5).map((user) => {
                    const userIssues = issues.filter(
                      (i) => i.assigneeId === user.id
                    );
                    return (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.role}
                          </p>
                        </div>
                        <Badge variant="secondary">
                          {userIssues.length} issues
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.slice(0, 5).map((issue) => {
                    const assignee = getUserById(issue.assigneeId);
                    return (
                      <div
                        key={issue.id}
                        className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0"
                      >
                        {assignee && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={assignee.avatar} />
                            <AvatarFallback>
                              {assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">
                              {assignee?.name || "Unknown"}
                            </span>{" "}
                            updated issue{" "}
                            <Link
                              href={`/issues/${issue.id}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {issue.id}
                            </Link>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(issue.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={statusColors[issue.status]}
                        >
                          {statusLabels[issue.status]}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
