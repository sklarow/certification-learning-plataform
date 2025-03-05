import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const questionSchema = z.object({
  text: z.string().min(1),
  options: z.string(),
  correctAnswer: z.string().min(1),
  objectiveId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = questionSchema.parse(body);

    const question = await prisma.question.create({
      data: {
        text: validatedData.text,
        options: validatedData.options,
        correctAnswer: validatedData.correctAnswer,
        objectiveId: validatedData.objectiveId,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 