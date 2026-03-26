import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      assignee: true, // the assigned user
      user: true, // the creator
    },
  });

  const formatted = issues.map((issue) => {
    // Pick which user you want to display
    const user = issue.assignee || issue.user; // show assignee first, fallback to creator

    return {
      id: issue.id,
      userName: user?.name || "Unknown",
      userAvatar: user?.name?.[0] || "?", // first letter
      action: "created issue",
      issueTitle: issue.title,
      issueId: issue.id,
      timestamp: issue.createdAt.toISOString(),
    };
  });

  return NextResponse.json(formatted);
}
