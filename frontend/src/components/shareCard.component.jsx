import { useContext } from "react";
import { ThemeContext } from "../App.jsx"; // Adjust the path as needed

const ShareCard = ({
  author,
  title,
  totalLikes,
  totalComments,
  authorUsername,
  profileImg,
  banner,
  blogLink,
}) => {
  let { theme } = useContext(ThemeContext);

  return (
    <div
      className={`p-4 rounded-lg shadow-lg ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
      style={{
        width: "350px",
        border: "1px solid",
        borderColor: theme === "dark" ? "#333" : "#ddd",
      }}
    >
      {/* Banner */}
      <div className="relative">
        <img
          src={banner}
          alt={title}
          className="rounded-lg w-full h-40 object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h2 className="text-lg font-bold mb-2">{title}</h2>

        {/* Author */}
        <div className="flex items-center mb-4">
          <img
            src={profileImg}
            alt={authorUsername}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-gray-500">@{authorUsername}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <i className="fi fi-rr-heart text-red-500 mr-1"></i>
            {totalLikes} Likes
          </div>
          <div className="flex items-center">
            <i className="fi fi-rr-comment-alt text-blue-500 mr-1"></i>
            {totalComments} Comments
          </div>
        </div>
      </div>

      {/* Share Link */}
      <a
        href={blogLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`block mt-4 text-center py-2 rounded ${
          theme === "dark" ? "bg-blue-500 text-white" : "bg-blue-600 text-white"
        } hover:opacity-90`}
      >
        View Blog
      </a>
    </div>
  );
};

export default ShareCard;
