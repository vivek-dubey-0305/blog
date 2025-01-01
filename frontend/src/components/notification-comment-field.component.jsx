import { useContext, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCommentField = ({
  _id,
  blog_author,
  index = undefined,
  replyingTo = undefined,
  setReplying,
  notification_id,
  notificationData,
}) => {
  // *State
  let [comment, setComment] = useState("");

  // *Destructuring!
  let { _id: user_id } = blog_author;

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  let {
    notifications,
    notifications: { results },
    setNotifications,
  } = notificationData;

  // *HandleComment

  const handleComment = async () => {
    // if (!access_token) {
    //     return toast.error("Login first to Comment");
    //   }

    if (!comment.length) {
      return toast.error("Write something to Comment..");
    }

    await axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        {
          _id,
          blog_author: user_id,
          comment,
          replying_to: replyingTo,
          notification_id,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
    

        setReplying(false);
        results[index].reply = { comment, _id: data._id };

        setNotifications({ ...notifications, results });
      })

      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <Toaster />
      <textarea
        value={comment}
        placeholder="Leave a reply..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        Reply
      </button>
    </>
  );
};

export default NotificationCommentField;
