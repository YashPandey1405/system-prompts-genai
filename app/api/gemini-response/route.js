import { NextResponse } from "next/server";
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req) {
  try {
    // Parse JSON body (array of messages)
    const data = await req.json();
    // console.log("Received array:", data);

    const response = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: data, // expecting OpenAI-style messages
    });

    const finalResponse = response.choices[0].message.content;
    console.log(`The response from Gemini is: ${finalResponse}`);

    return NextResponse.json({
      message: "Array received successfully!",
      received: finalResponse,
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 }
    );
  }
}
