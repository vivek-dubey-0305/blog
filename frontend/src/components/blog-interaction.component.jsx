import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      title,
      blog_id,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { username: author_username },
      },
    },
    setBlog,
    isLikedByUser,
    setIsLikedByUser,
    setCommentsWrapper,
  } = useContext(BlogContext);

  let {
    userAuth: { username, access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (access_token) {
      // ? request to server to get like information

      axios
        .post(
          import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user",
          {
            _id,
          },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
        .then(({ data: { result } }) => {
          setIsLikedByUser(Boolean(result));
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  }, []);

  // handleLike
  const handleLike = async () => {
    if (!access_token) {
      return toast.error("PLEASE LOGIN TO LIKE THIS BLOG");
    }

    try {
      // Optimistically update the UI
      setIsLikedByUser((prev) => !prev);
      const updatedTotalLikes = isLikedByUser
        ? total_likes - 1
        : total_likes + 1;
      setBlog({
        ...blog,
        activity: { ...activity, total_likes: updatedTotalLikes },
      });

      // Make the API call
      const { data } = await axios.post(
        import.meta.env.VITE_SERVER_DOMAIN + "/like-blog",
        { _id },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Update the UI based on the backend response
      setIsLikedByUser(data.liked_by_user);
      setBlog({
        ...blog,
        activity: { ...activity, total_likes: data.total_likes },
      });
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while liking the blog.");
    }
  };

  return (
    <>
      <Toaster />
      <hr className="border-grey my-2" />

      <div className="flex gap-6 justify-between">
        <div className="flex gap-3 items-center">
          {/* Herat */}
          <button
            onClick={handleLike}
            className={
              "w-10 h-10 rounded-full flex items-center justify-center " +
              (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")
            }
          >
            <i
              className={
                "fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")
              }
            ></i>
          </button>
          <p className="text-xl text-dark-grey">{total_likes}</p>

          {/* Comment */}
          <button
            onClick={() => setCommentsWrapper((prev) => !prev)}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80"
          >
            <i className="fi fi-rr-comment-dots"></i>
          </button>
          <p className="text-xl text-dark-grey">{total_comments}</p>
        </div>

        <div className="flex gap-6 items-center ">
          {/* Edit */}
          {username == author_username ? (
            <Link
              to={`/editor/${blog_id}`}
              className="underline hover:text-purple"
            >
              Edit
            </Link>
          ) : (
            " "
          )}
          {/* Tweet */}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className="fi fi-brands-twitter text-xl hover:text-twitter"></i>
          </Link>
        </div>
      </div>

      <hr className="border-grey my-2" />
    </>
  );
};

export default BlogInteraction;
