"use client";

import useSWR from "swr";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity as ActivityIcon, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Activity as ActivityType } from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function ActivityPanel() {
  // ✅ SWR fetches the recent activities automatically
  const { data: activities, mutate } = useSWR<ActivityType[]>(
    "/api/activities/recent",
    fetcher,
    { refreshInterval: 5000 }, // optional: refresh every 5s
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-card-foreground">
            Recent Activity
          </h2>
        </div>
        <Link
          href="/activity"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="px-5 py-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 h-full w-px bg-border" />

          <div className="space-y-6">
            {activities?.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isLast={index === activities.length - 1}
              />
            )) ?? (
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  activity,
  isLast,
}: {
  activity: ActivityType;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-4 pl-2">
      {/* Timeline dot */}
      <div className="absolute left-[11px] z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary">
        <div className="h-2 w-2 rounded-full bg-primary-foreground" />
      </div>

      <div className="ml-10 flex-1">
        <div className="flex items-start gap-3">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {activity.userAvatar}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-card-foreground">
              <span className="font-medium">{activity.userName}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>
            </p>
            {activity.issueTitle && (
              <Link
                href={`/issues/${activity.issueId}`}
                className="mt-1 block text-sm text-primary hover:underline truncate"
              >
                {activity.issueTitle}
              </Link>
            )}
            <p className="mt-1 text-xs text-muted-foreground">
              {formatRelativeTime(activity.timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
