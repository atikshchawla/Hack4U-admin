import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function GET(
  req,
  { params }
) {
  try {
    if (!params) {
      return new NextResponse(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { team_id } = await params;

    if (!team_id || !/^[a-f\d]{24}$/i.test(team_id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid team ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
      return new NextResponse(
        JSON.stringify({ error: "Missing email query parameter" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const team = await prisma.team.findFirst({
      where: { id: team_id }
    });

    if (!team) {
      return new NextResponse(
        JSON.stringify({ error: "Team not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const reviewer = await prisma.admin.findFirst({
      where: { email: email },
    })

    const review = await prisma.review.findFirst({
      where: { teamId: team_id, reviewerUserId: reviewer.id }
    });

    if (!review) {
      return new NextResponse(
      JSON.stringify({
        teamName: team.name,
        teamId: team.id,
        track: team.track,
        teamRound: team.round || 1,
        roundNum: 1,
        roundDetails: {
            problemClarity: 0,
            UIUX: 0,
            feasibility: 0,
            TechStack: 0,
            pitch: 0,
        },
        remarks: '',
        reviewerEmail: email,
        reviewerRegNo: reviewer.registrationNumber,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    }

    if (review.round !== "ONE" && review.round !== "TWO") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid round value in review" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const round = review.round === "ONE"
      ? await prisma.round_1.findFirst({ where: { id: review.round_id } })
      : await prisma.round_2.findFirst({ where: { id: review.round_id } });

    if (!round) {
      return new NextResponse(
        JSON.stringify({ error: `Round ${review.round} details not found` }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const {id, ...roundDetails} = round;
    const {Total, ...marks} = roundDetails;

    return new NextResponse(
      JSON.stringify({
        teamName: team.name,
        teamId: team.id,
        track: team.track,
        teamRound: team.round || 1,
        roundNum: review.round === "ONE" ? 1 : review.round === "TWO" ? 2 : 3,
        roundDetails: marks,
        remarks: review.remarks,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    if (error.code === "P2025") {
      return new NextResponse(
        JSON.stringify({ error: "Record not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2023") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P1001" || error.code === "P1002") {
      return new NextResponse(
        JSON.stringify({ error: "Database connection failed" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unexpected error in GET /api/team_remarks/[team_id]:", error);

    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(
  req,
  { params }
) {
  try {
    if (!params) {
      return new NextResponse(
        JSON.stringify({ error: "Missing parameters" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { team_id } = await params;

    if (!team_id || !/^[a-f\d]{24}$/i.test(team_id)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid team ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await req.json()



    const { roundDetails: marks, remarks, reviewerRegNo: regNo, roundNum } = data;
    marks.Total = Object.values(marks).reduce((acc, val) => acc + val, 0);

    if (!marks) {
      return new NextResponse(
        JSON.stringify({ error: "Missing marks in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (remarks === undefined || remarks === null) {
      return new NextResponse(
        JSON.stringify({ error: "Missing remarks in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }



    if (!roundNum) {
      return new NextResponse(
        JSON.stringify({ error: "Missing roundNum in request body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }



    if (roundNum !== 1 && roundNum !== 2) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid roundNum. Must be 'ONE' or 'TWO'" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (roundNum === 1) {
      const requiredFields = ["problemClarity", "UIUX", "feasibility", "TechStack", "pitch", "Total"];
      const missingFields = requiredFields.filter(field => marks[field] === undefined);

      if (missingFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Missing required fields for Round 1: ${missingFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const invalidFields = requiredFields.filter(field =>
        typeof marks[field] !== "number" || isNaN(marks[field])
      );

      if (invalidFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Invalid numeric values for fields: ${invalidFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      const requiredFields = ["designUX", "technicalExecution", "web3Integration", "impact", "completeness", "futureScope", "Total"];
      const missingFields = requiredFields.filter(field => marks[field] === undefined);

      if (missingFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Missing required fields for Round 2: ${missingFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      const invalidFields = requiredFields.filter(field =>
        typeof marks[field] !== "number" || isNaN(marks[field])
      );

      if (invalidFields.length > 0) {
        return new NextResponse(
          JSON.stringify({
            error: `Invalid numeric values for fields: ${invalidFields.join(", ")}`
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const teamExists = await prisma.team.findFirst({
      where: { id: team_id }
    });

    if (!teamExists) {
      return new NextResponse(
        JSON.stringify({ error: "Team not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const reviewer = await prisma.admin.findFirst({
      where: { registrationNumber: regNo }
    });

    if (!reviewer) {
      return new NextResponse(
        JSON.stringify({ error: "Reviewer not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const review = await prisma.remarks.create({
      data: {
        teamId: team_id,
        round: marks.roundNum === 1 ? "ONE" : marks.roundNum === 2 ? "TWO" : "THREE",
        ...marks.roundDetails,
        reviewerId: reviewer.id, 
      },
    });

    let round_id;
    try {
      const roundRecord = roundNum === 1
        ? await prisma.round_1.create({ data: marks  })
        : await prisma.round_2.create({ data: marks });

      round_id = roundRecord.id;
    } catch (error) {
      console.error("Error creating round record:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to create round record" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const dbData = {
      round: roundNum === 1 ? "ONE" : "TWO",
      round_id: round_id,
      remarks: remarks,
    };

    try {
      const existingReview = await prisma.review.findFirst({
        where: { teamId: team_id, reviewerUserId: reviewer.id }
      });

      if (existingReview) {
        await prisma.review.update({
          where: { id: existingReview.id },
          data: dbData
        });
      } else {
        await prisma.review.create({ data: { ...dbData, teamId: team_id, reviewerUserId: reviewer.id}});
      }

      return new NextResponse(
        JSON.stringify({
          message: existingReview ? "Review updated successfully" : "Review created successfully",
          reviewId: existingReview?.id,
          roundId: round_id
        }),
        { status: existingReview ? 200 : 201, headers: { "Content-Type": "application/json" } }
      );

    } catch (error) {
      console.error("Error saving review:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to save review" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    if (error.code === "P2025") {
      return new NextResponse(
        JSON.stringify({ error: "Record not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2023") {
      return new NextResponse(
        JSON.stringify({ error: "Invalid ID format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2002") {
      return new NextResponse(
        JSON.stringify({ error: "Duplicate record - review already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P2003") {
      return new NextResponse(
        JSON.stringify({ error: "Foreign key constraint failed" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error.code === "P1001" || error.code === "P1002") {
      return new NextResponse(
        JSON.stringify({ error: "Database connection failed" }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Unexpected error in POST /api/team_remarks/[team_id]:", error);

    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}