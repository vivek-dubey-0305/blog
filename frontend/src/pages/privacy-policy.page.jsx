import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../App";
// import { ThemeContext } from "../context/theme.context";

const PrivacyPolicyPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen px-6 py-12 lg:px-16 lg:py-20 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p className="leading-relaxed">
            Welcome to our blog website. We are committed to protecting your
            privacy and ensuring a safe browsing experience. This privacy
            policy outlines how we collect, use, and protect your personal
            information.
          </p>
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Personal Information:</strong> Name, email address, and
              other contact details you provide when signing up or contacting us.
            </li>
            <li>
              <strong>Usage Data:</strong> IP address, browser type, and usage
              patterns collected through cookies.
            </li>
          </ul>
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To personalize your experience on our website.</li>
            <li>To communicate updates, newsletters, or promotional content.</li>
            <li>To enhance website functionality and security.</li>
          </ul>
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold">Cookies Policy</h2>
          <p className="leading-relaxed">
            We use cookies to improve your experience and analyze site usage.
            You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Access to your data and request corrections.</li>
            <li>Opt-out of receiving marketing communications.</li>
            <li>Request deletion of your personal information.</li>
          </ul>
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold">Terms and Conditions</h2>
          <p className="leading-relaxed">
            By using this website, you agree to abide by the following terms and
            conditions:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>You will not use the website for any unlawful purposes.</li>
            <li>
              You agree not to copy, distribute, or modify any content without
              prior permission.
            </li>
            <li>
              The website owners are not responsible for any external links or
              third-party content.
            </li>
          </ul>
        </section>

        <section className="space-y-6 mt-8">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p className="leading-relaxed">
            If you have any questions about our privacy policy or terms of
            service, feel free to contact us at
            <a
              href="mailto:support@blogwebsite.com"
              className="text-blue-500 underline ml-1"
            >
              support@blogwebsite.com
            </a>
            .
          </p>
        </section>

        <footer className="mt-12 text-center">
          <p className="text-sm opacity-75">
            &copy; {new Date().getFullYear()} Blog Website. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
