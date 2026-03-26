"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FolderKanban, Star, Plus, Users, Bug, ArrowRight } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import type { Project, Issue } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ProjectCard({
  project,
  onToggleStar,
}: {
  project: Project;
  onToggleStar: (id: string, starred: boolean) => void;
}) {
  const { data: issues } = useSWR<Issue[]>(
    `/api/issues?project=${project.id}`,
    fetcher,
  );

  const openIssues = issues?.filter((i) => i.status !== "done").length ?? 0;
  const criticalIssues =
    issues?.filter((i) => i.priority === "critical").length ?? 0;

  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${project.color} text-primary-foreground`}
            >
              <FolderKanban className="h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-base font-semibold">
                {project.name}
              </CardTitle>
              <span className="text-xs font-mono text-muted-foreground">
                {project.tag}
              </span>
            </div>
          </div>

          {/* ⭐ STAR BUTTON */}
          <button
            onClick={() => onToggleStar(project.id, project.starred)}
            className="hover:scale-110 transition"
          >
            <Star
              className={`h-5 w-5 transition ${
                project.starred
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description ?? "No description provided"}
        </p>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Bug className="h-4 w-4" />
            <span>{openIssues} open</span>
          </div>

          {criticalIssues > 0 && (
            <Badge variant="destructive" className="text-xs">
              {criticalIssues} critical
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-muted text-xs">
                {project.leadName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {project.leadName}
            </span>
          </div>

          <Link href={`/projects/${project.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs group-hover:text-primary"
            >
              View
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectsPage() {
  const {
    data: projects,
    mutate,
    isLoading,
  } = useSWR<Project[]>("/api/projects", fetcher);

  // ⭐ FIXED STAR TOGGLE (SWR VERSION)
  const handleToggleStar = async (
    projectId: string,
    currentStarred: boolean,
  ) => {
    try {
      // 🔥 Optimistic update (instant UI)
      mutate(
        (prev) =>
          prev?.map((p) =>
            p.id === projectId ? { ...p, starred: !currentStarred } : p,
          ),
        false,
      );

      const res = await fetch("/api/projects/star", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          starred: !currentStarred,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Star API failed", data);
        mutate(); // rollback refetch
        return;
      }

      // 🔥 sync with server response
      mutate();
    } catch (err) {
      console.error("Star toggle error:", err);
      mutate(); // rollback
    }
  };

  const starredCount = projects?.filter((p) => p.starred).length ?? 0;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track all your team projects
            </p>
          </div>

          <Link href="/projects/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <FolderKanban className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{projects?.length ?? 0}</p>
                  <p className="text-xs text-muted-foreground">
                    Total Projects
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{starredCount}</p>
                  <p className="text-xs text-muted-foreground">Starred</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(projects?.map((p) => p.leadId)).size}
                  </p>
                  <p className="text-xs text-muted-foreground">Team Leads</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Bug className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {projects?.reduce((a, p) => a + p.issueCount, 0) ?? 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PROJECT GRID */}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onToggleStar={handleToggleStar}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
