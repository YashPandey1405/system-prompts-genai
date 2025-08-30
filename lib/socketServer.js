import { WebSocketServer } from "ws";
import OpenAI from "openai";

let wss;

export function initWebSocketServer(server) {
  if (wss) return wss;

  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("🔌 Client connected");

    ws.on("message", async (message) => {
      const messages = JSON.parse(message.toString());

      const openai = new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      });

      try {
        while (true) {
          const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages,
          });

          const rawContent = response.choices[0].message.content;
          const parsedContent = JSON.parse(rawContent);

          // push back into history
          messages.push({
            role: "assistant",
            content: JSON.stringify(parsedContent),
          });

          // 🚀 Send event back to frontend
          ws.send(JSON.stringify(parsedContent));

          if (parsedContent.step === "START") continue;

          if (parsedContent.step === "THINK") {
            messages.push({
              role: "developer",
              content: JSON.stringify({
                step: "EVALUATE",
                content: "Nice, You are going on correct path",
              }),
            });
            continue;
          }

          if (parsedContent.step === "OUTPUT") {
            ws.close();
            break;
          }
        }
      } catch (err) {
        console.error("Error in WS loop:", err);
        ws.send(JSON.stringify({ step: "ERROR", content: err.message }));
        ws.close();
      }
    });

    ws.on("close", () => {
      console.log("❌ Client disconnected");
    });
  });

  return wss;
}
