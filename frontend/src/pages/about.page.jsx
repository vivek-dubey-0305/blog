import React, { useContext } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../App";
// import { ThemeContext } from "../context/theme.context";

const AboutPage = () => {
  const { theme } = useContext(ThemeContext);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : "bg-gradient-to-b from-gray-100 to-white text-gray-900"
      }`}
    >
      {/* Animated blobs */}
      <div
        className={`absolute top-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob ${
          theme === "dark" ? "bg-purple-600" : "bg-purple-300"
        }`}
      />
      <div
        className={`absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 ${
          theme === "dark" ? "bg-blue-600" : "bg-blue-300"
        }`}
      />
      <div
        className={`absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 ${
          theme === "dark" ? "bg-pink-600" : "bg-pink-300"
        }`}
      />

      <div className="container mx-auto px-4 py-16 relative">
        {/* Hero Section */}
        <motion.div className="text-center mb-20" {...fadeIn}>
          <h1
            className={`text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500`}
          >
            Welcome to InsightfulBlogs
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Where Knowledge Meets Creativity
          </p>
        </motion.div>

        {/* About Section */}
        <motion.div className="grid md:grid-cols-2 gap-12 mb-20" {...fadeIn}>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p>
              InsightfulBlogs is your gateway to a world of diverse perspectives
              and deep insights. We curate thought-provoking content across
              technology, culture, science, and personal development.
            </p>
            <div
              className={`group p-6 rounded-xl transition-all duration-300 ${
                theme === "dark" ? "hover:bg-gray-800" : "hover:bg-gray-200"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4 group-hover:text-purple-400">
                What We Cover
              </h3>
              <ul className="space-y-2">
                <li>🚀 Tech Innovations & AI</li>
                <li>🌱 Sustainable Living</li>
                <li>🧠 Personal Growth</li>
                <li>🎨 Creative Arts</li>
              </ul>
            </div>
          </div>

          {/* Quote Section */}
          <div
            className={`p-8 rounded-2xl transform hover:scale-105 transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-br from-gray-800 to-gray-900"
                : "bg-gradient-to-br from-gray-200 to-gray-300"
            }`}
          >
            <blockquote className="text-2xl font-serif italic">
              "Every article is a new perspective, every story a new adventure.
              Join us in exploring the boundless realms of knowledge."
            </blockquote>
            <p className="text-right mt-4 text-purple-400">
              - Our Editorial Team
            </p>
          </div>
        </motion.div>

        {/* Join Us Section */}
        <motion.div className="text-center" {...fadeIn}>
          <h2 className="text-3xl font-bold mb-8">Join Our Community</h2>
          <div
            className={`p-8 rounded-2xl max-w-2xl mx-auto transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            <p className="mb-6">
              Be part of our growing community of curious minds and thoughtful
              writers. Share your insights, engage in meaningful discussions,
              and connect with fellow knowledge seekers.
            </p>
            <button
              className={`bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-blue-600 transform hover:-translate-y-1 transition-all duration-300 ${
                theme == "dark" ? " text-black" : " text-black"
              }`}
            >
              Start Writing
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
