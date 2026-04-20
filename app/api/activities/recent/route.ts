import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      assignee: true,
      user: true,
    },
  });

  const formatted = issues.map((issue) => {
    const user = issue.assignee || issue.user;

    return {
      id: issue.id,
      userName: user?.name || "Unknown",
      userAvatar: user?.name?.[0] || "?",
      action: "created issue",
      issueTitle: issue.title,
      issueId: issue.id,
      timestamp: issue.createdAt.toISOString(),
    };
  });

  return NextResponse.json(formatted);
}
