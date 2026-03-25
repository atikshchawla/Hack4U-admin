import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, code, track } = body;

    const team = await prisma.team.create({
      data: {
        name,
        code,
        track,
        submitted: false
      }
    });

    return NextResponse.json(team, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 });
  }
}