"use client";

import useSWR from "swr";
import { useSession } from "next-auth/react";
import { ClipboardList, Clock, CheckCircle2, Eye } from "lucide-react";
import { WelcomeCard } from "./welcome-card";
import { StatCard } from "./stat-card";
import { ProjectsPanel } from "./projects-panel";
import { ActivityPanel } from "./activity-panel";
import { AssignedIssuesPanel } from "./assigned-issues-panel";
import type { DashboardStats, Project, Activity, Issue } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function DashboardContent() {
  const { data: session } = useSession();

  const { data: stats } = useSWR<DashboardStats>(
    "/api/dashboard/stats",
    fetcher,
  );

  const { data: projects } = useSWR<Project[]>("/api/projects", fetcher);

  const { data: activities } = useSWR<Activity[]>(
    "/api/activities/recent",
    fetcher,
  );

  // ⭐ dynamic logged-in user issues
  const userId = session?.user?.id;

  const { data: myIssues } = useSWR<Issue[]>(
    userId ? `/api/issues?assigneeId=${userId}` : null,
    fetcher,
  );

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* ✅ Welcome Card Dynamic */}
      <WelcomeCard userName={session?.user?.name || "User"} />

      {/* Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Todo List"
          value={stats?.todo ?? 0}
          icon={ClipboardList}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={stats?.inProgress ?? 0}
          icon={Clock}
          color="blue"
        />
        <StatCard
          title="Review"
          value={stats?.review ?? 0}
          icon={Eye}
          color="orange"
        />
        <StatCard
          title="Complete"
          value={stats?.done ?? 0}
          icon={CheckCircle2}
          color="purple"
        />
      </div>

      {/* Dashboard Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ProjectsPanel projects={projects ?? []} />
        </div>

        <div className="lg:col-span-1">
          <ActivityPanel activities={activities ?? []} />
        </div>

        <div className="lg:col-span-1">
          <AssignedIssuesPanel
            issues={(myIssues ?? []).filter((i) => i.status !== "done")}
          />
        </div>
      </div>
    </div>
  );
}
