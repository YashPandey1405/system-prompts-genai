"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { FiBookOpen } from "react-icons/fi";

export default function Home() {
  const SYSTEM_PROMPT = `
        You are an AI assistant who works on START, THINK and OUTPUT format.
        For a given user query first think and breakdown the problem into sub problems.
        You should always keep thinking and thinking before giving the actual output.
        Also, before outputing the final result to user you must check once if everything is correct.

        Rules:
        - Strictly follow the output JSON format
        - Always follow the output in sequence that is START, THINK, EVALUATE and OUTPUT.
        - After evey think, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
        - Always perform only one step at a time and wait for other step.
        - Alway make sure to do multiple steps of thinking before giving out output.

        Output JSON Format:
        { "step": "START | THINK | EVALUATE | OUTPUT", "content": "string" }

        Example:
        User: Can you solve 3 + 4 * 10 - 4 * 3
        ASSISTANT: { "step": "START", "content": "The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem" } 
        ASSISTANT: { "step": "THINK", "content": "This is typical math problem where we use BODMAS formula for calculation" } 
        ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" } 
        ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all multiplications and divisions" }
        ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4 * 10 that is 40" } 
        ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
        ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" } 
        ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" } 
        ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" } 
        ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" } 
        ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" } 
        ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
        ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" } 
  `;

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ]);

  const [input, setInput] = useState("");
  const [output, setOutput] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const themeClass = useMemo(
    () =>
      darkMode
        ? "bg-gray-900 text-white border-gray-700"
        : "bg-white text-gray-900 border-gray-200",
    [darkMode]
  );

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post("/api/cot-response", newMessages, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response from server:", res);

      const steps = res?.data?.steps || [];
      let updatedMessages = [...newMessages]; // base copy

      steps.forEach((step) => {
        updatedMessages = [
          ...updatedMessages,
          { role: "assistant", content: step.content },
        ];
      });

      const reply = res?.data?.received || "No response from server";

      setMessages(updatedMessages);
      setOutput(updatedMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${themeClass} min-h-screen flex flex-col`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2 text-xl font-bold">
          <FiBookOpen className="text-yellow-500" />
          Chain Of Thoughts
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-lg border hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages
          .filter((msg) => msg.role !== "system") // hide system prompt
          .map((msg, i) => (
            <div
              key={i}
              className={`max-w-xl p-3 rounded-2xl shadow ${
                msg.role === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-900 mr-auto dark:bg-gray-700 dark:text-gray-100"
              }`}
            >
              <span className="block text-sm opacity-75 mb-1">
                {msg.role === "user" ? "You" : "YashNote"}
              </span>
              {msg.content}
            </div>
          ))}
        {loading && (
          <div className="italic text-gray-500 dark:text-gray-400">
            Thinking...
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="mx-12 px-6 py-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none text-white  focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600"
            placeholder="Type your prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </footer>
    </div>
  );
}

// { role: "user", content: "which model are you?" },
