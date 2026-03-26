"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, ChevronRight, Circle } from "lucide-react";
import Link from "next/link";
import type { Issue, Priority } from "@/lib/types";

interface AssignedIssuesPanelProps {
  issues: Issue[];
}

const priorityConfig: Record<
  Priority,
  { label: string; className: string; dotColor: string }
> = {
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground",
    dotColor: "text-muted-foreground",
  },
  medium: {
    label: "Medium",
    className: "bg-chart-3/10 text-chart-3",
    dotColor: "text-chart-3",
  },
  high: {
    label: "High",
    className: "bg-chart-5/10 text-chart-5",
    dotColor: "text-chart-5",
  },
  critical: {
    label: "Critical",
    className: "bg-destructive/10 text-destructive",
    dotColor: "text-destructive",
  },
};

const statusConfig: Record<
  Issue["status"],
  { label: string; className: string }
> = {
  todo: { label: "To Do", className: "bg-muted text-muted-foreground" },
  "in-progress": { label: "In Progress", className: "bg-chart-2/10 text-chart-2" },
  review: { label: "Review", className: "bg-chart-3/10 text-chart-3" },
  done: { label: "Done", className: "bg-primary/10 text-primary" },
};

export function AssignedIssuesPanel({ issues }: AssignedIssuesPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-card-foreground">Assigned to Me</h2>
        </div>
        <Link
          href="/my-issues"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="divide-y divide-border">
        {issues.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No issues assigned to you
          </div>
        ) : (
          issues.map((issue) => <IssueItem key={issue.id} issue={issue} />)
        )}
      </div>
    </div>
  );
}

function IssueItem({ issue }: { issue: Issue }) {
  const priority = priorityConfig[issue.priority];
  const status = statusConfig[issue.status];

  return (
    <Link
      href={`/issues/${issue.id}`}
      className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
    >
      <Circle className={cn("mt-1 h-3 w-3 fill-current", priority.dotColor)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs font-mono">
            {issue.id}
          </Badge>
          <Badge className={cn("text-xs", priority.className)}>
            {priority.label}
          </Badge>
        </div>
        <h3 className="mt-2 text-sm font-medium text-card-foreground line-clamp-2">
          {issue.title}
        </h3>
        <div className="mt-2">
          <Badge className={cn("text-xs", status.className)}>
            {status.label}
          </Badge>
        </div>
      </div>
    </Link>
  );
}
