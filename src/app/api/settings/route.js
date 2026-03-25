import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const admins = await prisma.admin.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				registrationNumber: true,
			},
			orderBy: {
				name: "asc",
			},
		});

		return NextResponse.json(admins, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function POST(req) {
	try {
		const body = await req.json();
		const { name, email, regno } = body;
		const normalizedEmail = (email || "").trim().toLowerCase();

		if (!name || !normalizedEmail || !regno) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		const existingByEmail = await prisma.admin.findFirst({
			where: { email: normalizedEmail },
			select: { id: true },
		});

		if (existingByEmail) {
			return NextResponse.json(
				{ error: "Admin with this email already exists" },
				{ status: 409 },
			);
		}

		const existingByRegNo = await prisma.admin.findFirst({
			where: { registrationNumber: regno },
			select: { id: true },
		});

		if (existingByRegNo) {
			return NextResponse.json(
				{ error: "Admin with this registration number already exists" },
				{ status: 409 },
			);
		}

		const input = await prisma.admin.create({
			data: {
				name: name.trim(),
				email: normalizedEmail,
				registrationNumber: regno,
			},
		});

		return NextResponse.json(input, { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
