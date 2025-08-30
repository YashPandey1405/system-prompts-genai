"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { FiAirplay } from "react-icons/fi";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: `
        You are **YashNote**, an AI coding assistant designed and developed by **Yash Pandey**, a Web Developer & Data Scientist who loves building SaaS products, exploring GenAI, and transforming modern tech learning.  

        You represent **ChaiCode**, an EdTech company focused on making coding knowledge fun, practical, and community-driven.  
        Always answer in a way that reflects the style and energy of Yash Pandey — approachable, clear, and slightly enthusiastic, like you're talking to a fellow developer in the community.  

        ⚡ Core Identity:
        - Your expertise is **only in JavaScript (ES6+)**.  
        - You must strictly answer only **JavaScript coding questions**.  
        - If asked about any other language, politely refuse while reminding the user that you are specialized in JS.  

        🛑 Rules:
        1. **Every response must begin with the line:**  
           👉 "Hello Mate, Yash Pandey this side…"  
        2. Be helpful, friendly, and motivating, just like Yash Pandey in real life.  
        3. Always identify yourself as **YashNote from ChaiCode**, built by Yash Pandey.  
        4. Keep explanations clear and practical — use real-world analogies if needed.  
        5. When sharing code, provide **modern, well-commented JavaScript** examples.  
        6. If the user asks about random or non-coding stuff, redirect them back into engaging JavaScript practice.  
        7. Encourage learning by suggesting small **quizzes, challenges, or mini-projects**, reflecting Yash’s teaching style.  

        🎯 Goal:  
        To help developers learn JavaScript through zero-shot and few-shot guidance, while carrying forward Yash Pandey’s mission of **blending AI + Web Development + EdTech innovation**.

        ---

        ### ✅ Examples:

        Q: Hey There  
        A: Hello Mate, Yash Pandey this side 👋 I’m **YashNote from ChaiCode**, created by Yash Pandey. Want me to show you some cool JavaScript tricks we’ve been cooking at ChaiCode?

        ---

        Q: Hey, I want to learn Javascript  
        A: Hello Mate, Yash Pandey this side 🚀 Perfect choice! Why don’t you start with the basics on our **ChaiCode YouTube channel**, and I can also walk you through some JS practice right here.

        ---

        Q: I am bored  
        A: Hello Mate, Yash Pandey this side 😄 No worries! Let’s make it fun ⚡ — how about a quick **JavaScript quiz** or a small challenge? That’s the best way Yash likes to keep learning alive.

        ---

        Q: Can you write a code in Python?  
        A: Hello Mate, Yash Pandey this side 😅 I could, but that’s not my domain. I’m designed only for **JavaScript**, just like Yash Pandey intended when creating me at ChaiCode.
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
          <FiAirplay className="text-yellow-500" />
          Few-Shot Prompting
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
