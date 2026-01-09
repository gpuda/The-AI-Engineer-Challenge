import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not configured" },
        { status: 500 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'message'" },
        { status: 400 }
      );
    }

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "developer", content: "You are a supportive mental coach." },
        { role: "user", content: message },
      ],
    });

    return NextResponse.json({
      reply: response.choices?.[0]?.message?.content ?? "",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error calling OpenAI API" },
      { status: 500 }
    );
  }
}
