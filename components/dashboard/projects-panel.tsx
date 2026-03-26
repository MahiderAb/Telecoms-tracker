"use client";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";

interface ProjectsPanelProps {
  projects: Project[];
}

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-card-foreground">Projects</h2>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-lg",
          project.color
        )}
      >
        <span className="text-sm font-bold text-primary-foreground">
          {project.tag.slice(0, 2)}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-card-foreground truncate">
            {project.name}
          </h3>
          <Badge variant="secondary" className="text-xs">
            {project.tag}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <Avatar className="h-5 w-5">
            <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
              {project.leadName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">
            {project.leadName}
          </span>
        </div>
      </div>
      <div className="text-right">
        <span className="text-sm font-medium text-card-foreground">
          {project.issueCount}
        </span>
        <p className="text-xs text-muted-foreground">issues</p>
      </div>
    </Link>
  );
}
