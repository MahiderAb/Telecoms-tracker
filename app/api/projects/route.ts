import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// ✅ GET PROJECTS
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        issues: true,
      },
    });

    const formatted = projects.map((p) => ({
      ...p,
      issueCount: p.issues.length,
      starred: p.starred ?? false,
      leadId: p.userId,
      leadName: "User",
      tag: "PROJ",
      color: "bg-primary",
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// ✅ CREATE PROJECT
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    const project = await prisma.project.create({
      data: {
        name: body.name,
        description: body.description || "",
        userId: "user-1", // ⭐ TEMP (we fix later)
        starred: false,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
