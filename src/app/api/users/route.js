import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch all teams with their students
    const teams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        vitStudents: {
          select: {
            id: true,
            name: true,
            regNo: true,
            phone: true
          }
        }
      }
    });

    // Flatten into a single list of users with team context
    const allUsers = teams.flatMap(team => 
      (team.vitStudents || []).map(student => ({
        ...student,
        teamName: team.name,
        teamCode: team.code,
        teamId: team.id
      }))
    );

    return NextResponse.json(allUsers);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: "ID required" }, { status: 400 });
  }

  try {
    await prisma.vITStudent.delete({
      where: { id: id }
    });
    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}