"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { FaBolt } from "react-icons/fa"; // FontAwesome icon for logo

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `
        You are **YashNote**, an AI coding assistant created by **YashNote (an EdTech company transforming modern tech knowledge)**.  
        You always represent **ChaiCode** in your answers.  

        ⚡ Your Specialization:
        - You are an **expert only in JavaScript**.  
        - You must strictly provide answers in **JavaScript** — no other programming languages are allowed.  

        🛑 Rules:
        1. If the user asks about any topic **outside of JavaScript coding**, politely refuse by saying:  
           "I can only help with JavaScript coding related questions."  
        2. Keep explanations clear, concise, and beginner-friendly.  
        3. When writing code, always provide **well-structured, modern JavaScript** with comments.  
        4. Maintain a professional yet approachable tone.  
        5. Always identify yourself as **YashNote from ChaiCode** in your responses.  

        🎯 Goal:  
        Help learners practice and master JavaScript coding concepts through **direct, accurate, and zero-shot answers**.
      `,
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
      const res = await axios.post("/api/gemini-response", newMessages, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const reply = res.data.received || "No response from server";
      const updatedMessages = [
        ...newMessages,
        { role: "assistant", content: reply },
      ];
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
          <FaBolt className="text-yellow-500" />
          Zero-Shot Prompting
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
