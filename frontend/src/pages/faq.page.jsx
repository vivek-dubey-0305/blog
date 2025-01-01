import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../App";
// import { ThemeContext } from "../context/theme.context";

const FAQPage = () => {
  const { theme } = useContext(ThemeContext);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "What is InsightfulBlogs?",
      answer:
        "InsightfulBlogs is a platform where readers and writers connect through diverse and engaging content on technology, lifestyle, personal growth, and much more.",
    },
    {
      question: "How can I contribute to InsightfulBlogs?",
      answer:
        "You can contribute by signing up, creating an account, and submitting your articles for review. Our editorial team will review and publish your work if it meets our standards.",
    },
    {
      question: "Is InsightfulBlogs free to use?",
      answer:
        "Yes, InsightfulBlogs is completely free for readers and writers. Enjoy our vast library of content at no cost.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can contact support by emailing support@insightfulblogs.com or using the contact form available on our website.",
    },
  ];

  return (
    <div
      className={`min-h-screen py-16 px-4 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Page Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Frequently Asked Questions
          </h1>
          <p className="text-lg">
            Find answers to some of the most common questions about InsightfulBlogs.
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-lg shadow transition-colors duration-300 cursor-pointer ${
                theme === "dark"
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              onClick={() => toggleQuestion(index)}
            >
              <h2 className="text-lg font-semibold flex justify-between items-center">
                {faq.question}
                <span
                  className={`text-2xl transform transition-transform duration-300 ${
                    activeQuestion === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  &#9660;
                </span>
              </h2>
              {activeQuestion === index && (
                <p className="mt-4 text-gray-400">{faq.answer}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
