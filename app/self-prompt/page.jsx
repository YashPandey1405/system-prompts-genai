"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { FiAirplay } from "react-icons/fi";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `You are YashNote, a helpful AI assistant. Answer as concisely as possible.`,
    },
  ]);

  const [input, setInput] = useState("");
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
    setMessages([]);

    if (!input.trim()) return;

    const newMessages = [{ role: "user", content: input }];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const res = await axios.post("/api/self-response", newMessages, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("API response:", res.data);

      const updatedMessages = [
        ...newMessages,
        { role: "assistant-A", content: res.data.responseA }, // Gemini 1.5
        { role: "assistant-B", content: res.data.responseB }, // Gemini 2.0
        { role: "judge", content: res.data.judge }, // Gemini 2.5
      ];
      setMessages(updatedMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Label mapping for clarity
  const roleLabels = {
    user: "🧑 You",
    "assistant-A": "🤖 Gemini 1.5 Flash",
    "assistant-B": "⚡ Gemini 2.0 Flash",
    judge: "🧑‍⚖️ Gemini 2.5 Judge",
  };

  return (
    <div className={`${themeClass} min-h-screen flex flex-col`}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2 text-xl font-bold">
          <FiAirplay className="text-yellow-500" />
          Self-Prompting (Multi-Gemini)
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
                  : msg.role === "assistant-A"
                  ? "bg-green-200 text-gray-900 mr-auto dark:bg-green-700 dark:text-white"
                  : msg.role === "assistant-B"
                  ? "bg-purple-200 text-gray-900 mr-auto dark:bg-purple-700 dark:text-white"
                  : "bg-yellow-200 text-gray-900 mr-auto dark:bg-yellow-700 dark:text-white"
              }`}
            >
              <span className="block text-sm opacity-75 mb-1">
                {roleLabels[msg.role] || "YashNote"}
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
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none text-black dark:text-white focus:ring focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600"
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
