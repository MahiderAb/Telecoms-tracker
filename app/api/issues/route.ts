import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("Received payload:", data); // DEBUG: see what is sent

    if (!data.projectId || !data.assigneeId || !data.title) {
      return new Response("Missing required fields", { status: 400 });
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });
    if (!project) {
      console.log("Project not found:", data.projectId);
      return new Response("Project not found", { status: 400 });
    }

    // Check if assignee exists
    const assignee = await prisma.user.findUnique({
      where: { id: data.assigneeId },
    });
    if (!assignee) {
      console.log("Assignee not found:", data.assigneeId);
      return new Response("Assignee not found", { status: 400 });
    }

    // Create issue
    const issue = await prisma.issue.create({
      data: {
        title: data.title,
        description: data.description || "",
        priority: data.priority || "medium",
        status: data.status || "todo",
        projectId: data.projectId,
        assigneeId: data.assigneeId,
        userId: data.userId || null,
      },
    });

    return new Response(JSON.stringify(issue), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
