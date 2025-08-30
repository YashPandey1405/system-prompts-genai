import { NextResponse } from "next/server";
import OpenAI from "openai";
import "dotenv/config";

const judge = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export async function POST(req) {
  try {
    const userMessages = await req.json(); // expecting [{role:"user",content:"..."}]

    // 1. Get response from Model A (DeepSeek)
    const responseA = await judge.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: userMessages,
    });

    const answerA = responseA.choices[0].message.content;

    // 2. Get response from Model B (Gemini)
    const responseB = await judge.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: userMessages,
    });

    const answerB = responseB.choices[0].message.content;

    // 3. Pass both answers to Judge model
    const judgePrompt = [
      {
        role: "system",
        content: `You are a neutral evaluator. You Are Getting 2 Responses , 1st From gemini-1.5-flash & 2nd One From gemini-2.0-flash
          Compare the two answers below and decide which is better. 
          Return a short explanation and say 'gemini-1.5-flash is better' or 'gemini-2.0-flash is better'`,
      },
      {
        role: "user",
        content: `Answer A:\n${answerA}\n\nAnswer B:\n${answerB}`,
      },
    ];

    const judgeResponse = await judge.chat.completions.create({
      model: "gemini-2.5-flash",
      messages: judgePrompt,
    });

    const evaluation = judgeResponse.choices[0].message.content;

    return NextResponse.json({
      message: "Self-prompt AI pipeline executed successfully!",
      responseA: answerA,
      responseB: answerB,
      judge: evaluation,
    });
  } catch (error) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: "Pipeline failed", details: error.message },
      { status: 500 }
    );
  }
}
