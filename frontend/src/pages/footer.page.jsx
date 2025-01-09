import { Link } from "react-router-dom";
import { ThemeContext } from "../App";
import { useContext } from "react";

const Footer = () => {
  let { theme } = useContext(ThemeContext);
  const footerLinks = [
    { name: "About", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms and Conditions", path: "/privacy-policy" },
    { name: "Disclaimer", path: "/disclaimer" },
    { name: "FAQ's", path: "/faq" },
  ];

  return (
    <footer className="w-full shadow-lg mt-auto border-t border-orange-300">
      <div
        className={`max-w-7xl mx-auto px-4 py-8 ${
          theme == "dark"
            ? "bg-transparent bg-opacity-40"
            : "bg-transparent bg-opacity-60"
        }`}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold bg-clip-text">InsightfulBlogs</h3>
            <p className="text-sm">
              Discover amazing stories and insights from our community of
              writers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              {footerLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`transition-colors duration-300 text-sm ${
                    theme == "dark"
                      ? "hover:text-blue-500"
                      : "hover:text-stone-400"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibol bg-clip-text">Contact US</h4>
            <p className="text-lg hover:text-green-500">+91 8269220295</p>
            <Link
              className="hover:text-green-500"
              to="mailto:support@what-a-great-blog.in"
            >
              <p className="text-lg">support@what-a-great-blog.in</p>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © {new Date().getFullYear()} what-a-great-blog. All rights
              reserved.
            </p>
            <div className="flex space-x-4">
              <Link
                to={`/about`}
                className="transition-transform transform hover:scale-110"
              >
                <i className="fi fi-brands-twitter text-xl text-blue-500 hover:text-blue-600"></i>
              </Link>
              <Link
                to={`/about`}
                className="transition-transform transform hover:scale-110"
              >
                <i className="fi fi-brands-facebook text-xl text-blue-500 hover:text-blue-700"></i>
              </Link>
              <Link
                to={`/about`}
                className="transition-transform transform hover:scale-110"
              >
                <i className="fi fi-brands-instagram text-xl text-pink-500 hover:text-pink-600"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
