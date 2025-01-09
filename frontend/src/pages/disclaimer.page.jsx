import React, { useContext } from "react";
import { ThemeContext } from "../App";
import { Link } from "react-router-dom";

const DisclaimerPage = () => {

    let {theme} = useContext(ThemeContext)
  return (
      <div className={`min-h-screen ${theme == "dark" ? "bg-gray-900 text-rose-100" : "bg-gray-50 text-gray-800"}`}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Disclaimer
        </h1>
        <p className="text-lg mb-4">
          Welcome to <strong>What-a-great-blog.in</strong>. By accessing and
          using this website, you agree to comply with and be bound by the
          following disclaimer, which governs our relationship with you in
          relation to this website.
        </p>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Content Accuracy
          </h2>
          <p>
            The information provided on this blog is for general informational
            purposes only. While we strive to ensure that all information is
            accurate and up-to-date, we make no guarantees about the accuracy,
            reliability, or completeness of any content on this site.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Professional Advice
          </h2>
          <p>
            The content on <strong>What-a-great-blog.in</strong> is not
            professional advice. It reflects the opinions and perspectives of
            individual authors and contributors. Always consult a professional
            for specific advice tailored to your situation.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            External Links
          </h2>
          <p>
            This blog may include links to external websites. These links are
            provided for convenience and informational purposes only. We have
            no control over the content or practices of these third-party sites
            and accept no responsibility for their accuracy or reliability.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Limitation of Liability
          </h2>
          <p>
            Under no circumstances shall <strong>What-a-great-blog.in</strong>{" "}
            or its contributors be liable for any damages or losses arising
            from the use of this website or its content. Use the information
            and resources at your own risk.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-3 text-blue-500">
            Updates to Disclaimer
          </h2>
          <p>
            This disclaimer is subject to change without prior notice. By
            continuing to use the site, you agree to be bound by the updated
            version of this disclaimer.
          </p>
        </section>
        <p className="text-lg text-center mt-8">
          If you have any question or concerns about this disclaimer, please
          contact us at-
          <Link
            to="mailto:support@what-a-great-blog.in"
            className="text-blue-500 underline"
          >
             support@what-a-great-blog.in
          </Link>
          
        </p>
      </div>
    </div>
  );
};

export default DisclaimerPage;
