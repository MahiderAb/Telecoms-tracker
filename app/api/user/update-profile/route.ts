import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const department = formData.get("department") as string;
    const file = formData.get("profileImage") as File | null;

    let profileImagePath: string | null = null;

    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = Date.now() + "-" + file.name;
      const uploadPath = path.join(process.cwd(), "public/uploads", fileName);

      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      fs.writeFileSync(uploadPath, buffer);

      profileImagePath = `/uploads/${fileName}`;
    }

    const userId = "user-1";

    await prisma.user.update({
      where: { id: userId },
      data: {
        name: firstName + " " + lastName,
        email: email,
        ...(profileImagePath && { image: profileImagePath }),
      },
    });

    return NextResponse.json({
      success: true,
      profileImagePath,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Profile update failed" },
      { status: 500 },
    );
  }
}
