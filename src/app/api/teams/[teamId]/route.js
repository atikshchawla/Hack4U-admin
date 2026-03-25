import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	const { teamId } = await params;
	console.log("RAW PARAMS", teamId);

	if (!teamId) {
		return NextResponse.json({ error: "teamId is required" }, { status: 400 });
	}

	try {
		const team = await prisma.team.findUnique({
			where: { id: teamId },
			select: {
				name: true,
				track: true,
				vitStudents: {
					select: {
						name: true,
						regNo: true,
					},
				},
				figmaLink: true,
				githubLink: true,
				pptLink: true,
				otherLinks: true,
			},
		});

		if (!team) {
			return NextResponse.json({ error: "Team not found" }, { status: 404 });
		}
		console.log(team);
		return NextResponse.json(team);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function DELETE(request, { params }) {
	const { teamId } = await params;
	try {
		await prisma.team.delete({ where: { id: teamId } });
		return NextResponse.json({ message: "Team deleted" });
	} catch (err) {
		return NextResponse.json(
			{ error: "Failed to delete team" },
			{ status: 500 },
		);
	}
}

export async function PUT(request, { params }) {
	const { teamId } = await params;
	const body = await request.json();
	const { name, track, members } = body; // members is array of { name, regNo }

	try {
		// Transaction to update team and sync members
		const result = await prisma.$transaction(async (tx) => {
			// 1. Update Team details
			const updatedTeam = await tx.team.update({
				where: { id: teamId },
				data: { name, track },
			});

			// 2. Sync members: Delete all existing and re-create (simplest for full list edit)
			// Note: In production, IDs should be preserved if possible, but this meets the "edit/add/remove" requirement effectively.
			if (members) {
				await tx.vITStudent.deleteMany({
					where: { teamId: teamId },
				});

				if (members.length > 0) {
					await tx.vITStudent.createMany({
						data: members.map((m) => ({
							name: m.name,
							regNo: m.regNo,
							teamId: teamId,
						})),
					});
				}
			}
			return updatedTeam;
		});

		return NextResponse.json(result);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Failed to update team" },
			{ status: 500 },
		);
	}
}
