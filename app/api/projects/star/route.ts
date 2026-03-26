import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { projectId, starred } = await req.json();

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        starred,
        stars: starred ? { increment: 1 } : { decrement: 1 },
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update star" },
      { status: 500 },
    );
  }
}
