import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";

let {

  blog: {

    title,
    banner,
    des,
    // activity,
    // activity: { total_likes, total_comments },
    // author: {
    //   personal_info: { username: author_username },
    // },
  },
} = useContext(BlogContext);

export const Head = () => {
  return (
    <FeaturedImage
      banner={"http://localhost:5173" + banner}
      description={des}
      url={window.location.href}
      title={title}
    />
  );
};
