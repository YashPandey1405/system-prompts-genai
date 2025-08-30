"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const implementations = [
    {
      title: "Zero-shot Prompting",
      desc: "Generate answers without prior examples.",
      route: "/zero-shot",
    },
    {
      title: "One-shot Prompting",
      desc: "Provide a single example for guidance.",
      route: "/one-shot",
    },
    {
      title: "Chain of Thought",
      desc: "Break down reasoning step by step.",
      route: "/cot",
    },
    {
      title: "Self Prompting",
      desc: "Models generate their own improved prompts.",
      route: "/self-prompt",
    },
    {
      title: "Persona Prompting",
      desc: "Answering as a custom persona (Yash).",
      route: "/persona-yash",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 flex flex-col items-center text-gray-100">
      {/* Hero Section */}
      <section className="w-full py-20 px-6 text-center relative overflow-hidden">
        {/* Animated gradient blobs */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-purple-600/40 blur-3xl rounded-full animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />

        <motion.img
          src="https://res.cloudinary.com/dah7l8utl/image/upload/v1750844086/TaskNexus_MERN-Project/oo5qxmxyw0c4aspjakzs.jpg"
          alt="Project Banner"
          className="w-40 h-40 rounded-full mx-auto shadow-xl mb-6 border-4 border-white/70"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        />

        <motion.h1
          className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I'm Yash Pandey 👋
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          A passionate Web Developer and Data Scientist, exploring the power of
          Generative AI and advanced backend systems. This mini-project
          demonstrates my implementations with the OpenAI API.
        </motion.p>
      </section>

      {/* Socials */}
      <section className="py-12 px-6 w-full max-w-4xl text-center">
        <h2 className="text-2xl font-semibold mb-6">🌐 Connect with Me</h2>
        <div className="flex justify-center gap-8">
          {[
            {
              icon: <Github className="w-6 h-6" />,
              href: "https://github.com/YashPandey1405",
            },
            {
              icon: <Linkedin className="w-6 h-6" />,
              href: "https://linkedin.com/in/yashpandey29/",
            },
            {
              icon: <Twitter className="w-6 h-6" />,
              href: "https://x.com/pandeyyash041",
            },
          ].map((s, i) => (
            <motion.a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {s.icon}
            </motion.a>
          ))}
        </div>
      </section>

      {/* Implementations */}
      <section className="py-20 px-6 w-full border-t border-white/10 bg-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" /> My OpenAI
            Implementations
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {implementations.map((impl, i) => (
              <motion.button
                key={impl.route}
                onClick={() => router.push(impl.route)}
                className="p-6 bg-white/10 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-purple-500/30 transition relative group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">{impl.title}</h3>
                <p className="text-sm text-gray-300">{impl.desc}</p>

                {/* Hover Icon */}
                <motion.div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-purple-400"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap className="w-5 h-5" />
                </motion.div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 text-center bg-black/40 border-t border-white/10 text-sm text-gray-400">
        © {new Date().getFullYear()} Yash Pandey. Built with ❤️ using Next.js +
        Tailwind + Framer Motion.
      </footer>
    </div>
  );
}
