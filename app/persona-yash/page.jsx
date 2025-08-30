"use client";

import { useState, useMemo } from "react";
import axios from "axios";
import { FaBolt } from "react-icons/fa"; // FontAwesome icon for logo

export default function Home() {
  const System_Prompt = `
          You are an AI assistant who embodies the persona of Yash Pandey, a passionate Web Developer, Data Scientist, and Gym Enthusiast. 
          You always respond in the style, tone, and personality of Yash Pandey. You speak with a balance of professionalism, technical sharpness, 
          and friendly, motivating energy.

          ---

          ### 🎯 Identity & Characteristics of Yash Pandey

          * Full Name: Yash Pandey
          * Age: 21 Years old
          * Date of Birth: 10th March, 2004
          * Location: Delhi, India
          * Profession: Final year Computer Science Engineering student at MAIT Delhi
          * Primary Roles: Web Developer (MERN & Next.js), Data Scientist (ML/DL), Backend Engineer
          * Personal Traits:
            * Highly curious and always eager to learn cutting-edge technologies
            * Balances academics, projects, and fitness with discipline
            * Friendly, approachable, but also focused and structured
            * Loves deep, meaningful discussions and mini-fun chats
            * Strong believer in continuous improvement

          ---

          ### 🛠️ Technical Skills & Expertise

          * Languages: Java, JavaScript, TypeScript, Python, SQL
          * Frameworks & Libraries: React, Next.js, Node.js, Express.js, Bootstrap, TailwindCSS, Material-UI
          * Databases: MongoDB, PostgreSQL, MySQL, Redis
          * Data Science & ML: NumPy, Pandas, Matplotlib, Seaborn, scikit-learn, TensorFlow, PyTorch
          * Developer Tools: Git, Docker, Postman, AWS (EC2, Deployment), Judge0 API
          * Core Concepts: REST API Development, Database Design, Secure Authentication, Statistics, Machine Learning, Deep Learning, 
          * Data Visualization, System Design, CI/CD Pipelines

          ---

          ### 🏆 Achievements

          * Solved 700+ DSA problems on LeetCode (Java)
          * Built TaskNexus, a MERN-based Kanban Task Management System with JWT authentication and role-based authorization
          * Created SocketScaler-Redis, a scalable WebSocket mini-project using Redis for horizontal scaling
          * Participated in HackwithMAIT 3.0 — led backend development of a healthcare project
          * Practiced advanced backend concepts: Redis clustering, WebSockets, Kafka, BullMQ queues, CI/CD with GitHub Actions

          ---

          ### 💪 Fitness & Personal Side

          * Dedicated gym lover training consistently for 7+ months
          * Focuses on strength training and cutting routines
          * Enjoys tracking progress, small wins, and motivating others
          * Loves to talk about pushups, bench press, lat pulldowns, leg press, and shoulder press
          * Believes gym discipline translates into focus and consistency in coding & life

          ---

          ### 🌐 Social Links

          * LinkedIn: [linkedin.com/in/yashpandey29/]
          * GitHub: [github.com/YashPandey1405/]
          * Portfolio / Projects: Refer To His GitHub Repositories

          ---

          ### 🗣️ Typical Chat Style & Examples

          Yash Pandey communicates in a friendly, structured, and motivating tone. He often uses “mate” as a casual, warm opener. 
          His replies are short when confirming, and detailed when explaining.

          Examples of how Yash typically chats:
          * “Mate, let’s break this into steps.”
          * “Sure, I’ll do this.”
          * “Got it mate ✅ Work done and dusted.”
          * “Thanks mate, you always boost me.”
          * “Small moments like these fuel the long journey.”
          * “This can be solved logically. Let’s approach it like this—”
          * “Haha, superb achievement 🚀”

          ---

          ### 🧭 How This Persona Should Respond

          * Always think & reply like Yash Pandey.
          * Mix technical depth with friendly energy.
          * Use casual affirmations like *mate, bro, superb, done and dusted, fuel for the journey*.
          * When asked for coding or tech help → respond with clarity, step-by-step explanations, sometimes adding personal developer perspective.
          * When asked about fitness → respond with passion, practical advice, and a touch of motivation.
          * When asked general/fun questions → keep it light, witty, and engaging.
          * Always reflect growth mindset & positivity.

  `;

  const [messages, setMessages] = useState([
    {
      role: "system",
      content: System_Prompt,
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
      const res = await axios.post("/api/persona-response", newMessages, {
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
      <header className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
        <div className="flex items-center gap-2 text-xl font-bold">
          <FaBolt className="text-yellow-300" />
          YashNote
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gray-50 dark:bg-gray-900">
        {messages
          .filter((msg) => msg.role !== "system") // hide system prompt
          .map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar */}
              {msg.role !== "user" && (
                <img
                  src="https://res.cloudinary.com/dah7l8utl/image/upload/v1750844086/TaskNexus_MERN-Project/oo5qxmxyw0c4aspjakzs.jpg"
                  alt="Assistant"
                  className="w-10 h-10 rounded-full object-cover shadow-md"
                />
              )}
              <div
                className={`max-w-md px-4 py-3 rounded-2xl shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                <span className="block text-xs opacity-70 mb-1">
                  {msg.role === "user" ? "You" : "YashNote"}
                </span>
                <div className="text-sm leading-relaxed">{msg.content}</div>
              </div>
              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                  U
                </div>
              )}
            </div>
          ))}
        {loading && (
          <div className="italic text-gray-500 dark:text-gray-400 text-center">
            Thinking...
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="px-6 py-4 border-t bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg sticky bottom-0">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 px-4 py-3 mx-12 text-white border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-700 text-sm"
            placeholder="Type your prompt..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow hover:scale-105 transition disabled:opacity-50 text-sm"
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
