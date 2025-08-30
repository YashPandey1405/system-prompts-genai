import { NextResponse } from "next/server";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req) {
  try {
    const messages = await req.json();

    console.log("Received messages:", messages);

    // const messages = [
    //   { role: "system", content: SYSTEM_PROMPT },
    //   { role: "user", content: userPrompt },
    // ];

    // Make a single API call. The model handles all the thinking and output generation at once.
    const response = await openai.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: messages,
      temperature: 0.2, // A low temperature helps with stable, logical reasoning.
    });

    const rawResponse = response.choices[0].message.content;
    console.log("--- Final Response (Single Prompt CoT) ---");
    console.log(rawResponse);

    function extractJSON(raw) {
      // 1. Remove markdown fences
      const cleaned = raw.replace(/```json|```/g, "").trim();

      // 2. Match all JSON blocks using regex
      const matches = cleaned.match(/{[^}]+}/g);

      if (!matches) return [];

      // 3. Parse each block into an object
      return matches
        .map((block) => {
          try {
            return JSON.parse(block);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
    }

    const steps = extractJSON(rawResponse);
    return NextResponse.json({
      message: "Steps generated successfully!",
      steps,
    });
  } catch (error) {
    console.error("COT API error:", error);
    return NextResponse.json(
      { error: "Failed to generate steps", details: error.message },
      { status: 500 }
    );
  }
}
