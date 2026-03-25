import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all critical data
    const [teams, users, admins] = await Promise.all([
      prisma.team.findMany({
        include: {
          vitStudents: true // Include related students
        }
      }),
      prisma.user.findMany().catch(() => []), // Fallback if User model issues
      prisma.admin.findMany().catch(() => []) // Fallback if Admin model issues
    ]);

    const backupData = {
      timestamp: new Date().toISOString(),
      teams,
      users,
      admins
    };

    return NextResponse.json(backupData);
  } catch (err) {
    console.error("Backup error:", err);
    return NextResponse.json({ error: "Failed to generate backup" }, { status: 500 });
  }
}