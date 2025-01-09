import { useEffect, useContext, useState } from "react";
import { ThemeContext } from "../App.jsx"; // Adjust the path as needed
import toast from "react-hot-toast";

const SharePopup = ({ title }) => {
  let { theme } = useContext(ThemeContext);

  // Share popup state
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Close the popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isShareOpen && !event.target.closest(".share-popup")) {
        setIsShareOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isShareOpen]);

    
    
    
  // Function to handle link click with delay
  const handleSocialClick = (url) => {
    setTimeout(() => {
      setIsShareOpen(false); // Close popup after a short delay
    }, 100); // Adjust the delay as needed
      console.log(url)
    window.open(url, "_blank");
  };

  // Handle copy link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
    setIsShareOpen(false);
  };
  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent immediate closing when toggling
          setIsShareOpen(!isShareOpen);
        }}
        className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
      >
        <i className="fi fi-ss-share text-xl hover:text-blue-600"></i>
      </button>

      {/* Share Popup */}
      {isShareOpen && (
        <div
          className={`absolute right-0 top-12 bg-white shadow-lg rounded p-4 border ${
            theme == "dark"
              ? "border-gray-950 border-l-rose-50"
              : "border-gray-50 border-l-black"
          } w-64 z-50 share-popup`} // Add "share-popup" class for easier event handling
        >
          <ul>
            <li
              onClick={handleCopyLink}
              className={`text-sm py-2 ${
                theme == "dark"
                  ? "text-rose-50 hover:bg-stone-900"
                  : "text-stone-900 hover:bg-gray-200"
              } cursor-pointer`}
            >
              <i className="fi fi-sr-copy p-2 hover:text-stone-700"></i>
              Copy Link
            </li>
            <li
              onClick={() =>
                handleSocialClick(
                  `https://wa.me/?text= ${window.location.href}`
                )
              }
              className={`text-sm py-2 ${
                theme == "dark"
                  ? "text-rose-50 hover:bg-stone-900"
                  : "text-stone-900 hover:bg-gray-200"
              } cursor-pointer`}
            >
              <i className="fi fi-brands-whatsapp p-2 hover:text-green-600"></i>
              WhatsApp
            </li>
            <li
              onClick={() =>
                handleSocialClick(
                  `https://www.instagram.com/sharer.php?u=${window.location.href}`
                )
              }
              className={`text-sm py-2 ${
                theme == "dark"
                  ? "text-rose-50 hover:bg-stone-900"
                  : "text-stone-900 hover:bg-gray-200"
              } cursor-pointer`}
            >
              <i className="fi fi-brands-instagram p-2 hover:text-pink-600"></i>
              Instagram
            </li>
            <li
              onClick={() =>
                handleSocialClick(
                  `https://twitter.com/intent/tweet?text=${title}&url=${window.location.href}`
                )
              }
              className={`text-sm py-2 ${
                theme == "dark"
                  ? "text-rose-50 hover:bg-stone-900"
                  : "text-stone-900 hover:bg-gray-200"
              } cursor-pointer`}
            >
              <i className="fi fi-brands-twitter p-2 hover:text-blue-600"></i>
              Twitter
            </li>
            <li
              onClick={() =>
                handleSocialClick(
                  `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
                )
              }
              className={`text-sm py-2 ${
                theme == "dark"
                  ? "text-rose-50 hover:bg-stone-900"
                  : "text-stone-900 hover:bg-gray-200"
              } cursor-pointer`}
            >
              <i className="fi fi-brands-facebook p-2 hover:text-blue-600"></i>
              Facebook
            </li>
            <li
              onClick={() =>
                handleSocialClick(
                  `https://discordapp.com/channels/@me?text=${title} ${window.location.href}`
                )
              }
              className={`text-sm py-2 ${
                theme == "dark"
                  ? "text-rose-50 hover:bg-stone-900"
                  : "text-stone-900 hover:bg-gray-200"
              } cursor-pointer`}
            >
              <i className="fi fi-brands-discord p-2 hover:text-stone-800"></i>
              Discord
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SharePopup;
