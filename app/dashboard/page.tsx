import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout, DashboardContent } from "@/components/dashboard";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  // Example: fetch all users for display
  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <DashboardLayout>
      <DashboardContent users={users} />
    </DashboardLayout>
  );
}
