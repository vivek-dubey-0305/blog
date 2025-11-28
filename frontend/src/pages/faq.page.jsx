import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../App";

const FAQPage = () => {
  const { theme } = useContext(ThemeContext);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  const faqs = [
    {
      question: "What is What-a-great-blog?",
      answer:
        "What-a-great-blog is your go-to platform for discovering diverse, engaging, and thought-provoking content on technology, culture, science, and personal development.",
    },
    {
      question: "How can I contribute to What-a-great-blog?",
      answer:
        "You can contribute by creating an account, submitting your articles, and connecting with our editorial team. If your submission meets our guidelines, it will be published to inspire readers worldwide.",
    },
    {
      question: "Is What-a-great-blog free to use?",
      answer:
        "Yes, What-a-great-blog is completely free for readers. Enjoy curated content and explore various perspectives at no cost.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can contact our support team by emailing support@what-a-great-blog.in or by using the contact form available on our website.",
    },
    {
      question: "What topics does What-a-great-blog cover?",
      answer:
        "Our platform covers a wide array of topics including technology, lifestyle, culture, science, and personal growth, ensuring something valuable for every reader.",
    },
  ];

  return (
    <div
      className={`min-h-screen py-16 px-4 transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-white text-gray-900"
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
            Find answers to some of the most common questions about
            What-a-great-blog.
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
