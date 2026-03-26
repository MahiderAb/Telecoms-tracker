"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  FolderKanban,
  Bug,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import type { Project, Issue } from "@/lib/types";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const priorityConfig = {
  critical: { label: "Critical", className: "bg-destructive text-destructive-foreground" },
  high: { label: "High", className: "bg-chart-5 text-foreground" },
  medium: { label: "Medium", className: "bg-warning text-warning-foreground" },
  low: { label: "Low", className: "bg-muted text-muted-foreground" },
};

const statusConfig = {
  todo: { label: "To Do", className: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In Progress", className: "bg-chart-2 text-foreground" },
  review: { label: "Review", className: "bg-chart-4 text-foreground" },
  done: { label: "Done", className: "bg-primary text-primary-foreground" },
};

function StarredProjectCard({ project }: { project: Project }) {
  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg ${project.color} text-primary-foreground shrink-0`}
          >
            <FolderKanban className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{project.name}</h3>
              <Star className="h-4 w-4 fill-warning text-warning shrink-0" />
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {project.description ?? "No description"}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="font-mono">{project.tag}</span>
              <span>{project.issueCount} issues</span>
            </div>
          </div>
          <Link href={`/projects/${project.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function StarredIssueCard({ issue }: { issue: Issue }) {
  const { data: projects } = useSWR<Project[]>("/api/projects", fetcher);
  const project = projects?.find((p) => p.id === issue.projectId);

  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted shrink-0">
            <Bug className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">{issue.title}</h3>
                  <Star className="h-3.5 w-3.5 fill-warning text-warning shrink-0" />
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {issue.id}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {issue.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                variant="secondary"
                className={cn("text-xs", priorityConfig[issue.priority].className)}
              >
                {priorityConfig[issue.priority].label}
              </Badge>
              <Badge
                variant="secondary"
                className={cn("text-xs", statusConfig[issue.status].className)}
              >
                {statusConfig[issue.status].label}
              </Badge>
              {project && (
                <Badge variant="outline" className="text-xs">
                  {project.tag}
                </Badge>
              )}
            </div>
          </div>
          <Link href={`/issues/${issue.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ type }: { type: "projects" | "issues" }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
          <Star className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-1">No starred {type}</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Star {type} to quickly access them later. Click the star icon on any{" "}
          {type === "projects" ? "project" : "issue"} to add it here.
        </p>
      </CardContent>
    </Card>
  );
}

export default function StarredPage() {
  const { data: projects, isLoading: projectsLoading } = useSWR<Project[]>(
    "/api/projects",
    fetcher
  );
  const { data: issues, isLoading: issuesLoading } = useSWR<Issue[]>(
    "/api/issues",
    fetcher
  );

  const starredProjects = projects?.filter((p) => p.starred) ?? [];
  const starredIssues = issues?.filter((i) => i.starred) ?? [];
  const totalStarred = starredProjects.length + starredIssues.length;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Star className="h-6 w-6 text-warning fill-warning" />
            Starred
          </h1>
          <p className="text-muted-foreground">
            Quick access to your favorite projects and issues
          </p>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-r from-warning/10 to-transparent border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/20">
                <Star className="h-6 w-6 text-warning fill-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalStarred}</p>
                <p className="text-sm text-muted-foreground">
                  {starredProjects.length} projects, {starredIssues.length} issues starred
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all" className="gap-2">
              All
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {totalStarred}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="projects" className="gap-2">
              Projects
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {starredProjects.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="issues" className="gap-2">
              Issues
              <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                {starredIssues.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {projectsLoading || issuesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-16 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : totalStarred === 0 ? (
              <EmptyState type="projects" />
            ) : (
              <>
                {starredProjects.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Projects
                    </h2>
                    <div className="space-y-2">
                      {starredProjects.map((project) => (
                        <StarredProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                )}
                {starredIssues.length > 0 && (
                  <div className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      Issues
                    </h2>
                    <div className="space-y-2">
                      {starredIssues.map((issue) => (
                        <StarredIssueCard key={issue.id} issue={issue} />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-3">
            {projectsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-16 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : starredProjects.length === 0 ? (
              <EmptyState type="projects" />
            ) : (
              <div className="space-y-2">
                {starredProjects.map((project) => (
                  <StarredProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="issues" className="space-y-3">
            {issuesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-16 bg-muted rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : starredIssues.length === 0 ? (
              <EmptyState type="issues" />
            ) : (
              <div className="space-y-2">
                {starredIssues.map((issue) => (
                  <StarredIssueCard key={issue.id} issue={issue} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
