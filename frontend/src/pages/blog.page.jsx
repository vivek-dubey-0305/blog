import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import { createContext } from "react";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, {
  fetchComments,
} from "../components/comments.component";

export const blogStructure = {
  title: "",
  des: "",
  content: [],
  banner: "",
  author: { personal_info: {} },
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [commentsWrapper, setCommentsWrapper] = useState(false);
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

  const {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog;

  const fetchBlog = async () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id,
      })
      .then(async ({ data: { blog } }) => {
        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded,
        });
        setBlog(blog);

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id,
          })
          .then(({ data }) => {
            setSimilarBlogs(data.blogs);
          });

        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    resetStates();
    fetchBlog();
  }, [blog_id]);

  const resetStates = () => {
    setBlog(blogStructure);
    setSimilarBlogs(null);
    setLoading(true);
    setIsLikedByUser(false);
    setCommentsWrapper(false);
    setTotalParentCommentsLoaded(0);
  };

  return (
    <AnimationWrapper>
      <div className="relative min-h-screen bg-light-mode dark:bg-dark-mode text-dark-text dark:text-light-text">
        {loading ? (
          <Loader />
        ) : (
          <BlogContext.Provider
            value={{
              blog,
              setBlog,
              isLikedByUser,
              setIsLikedByUser,
              commentsWrapper,
              setCommentsWrapper,
              totalParentCommentsLoaded,
              setTotalParentCommentsLoaded,
            }}
          >
            {/* Ads on the sides */}
            {/* <div className="fixed left-2 top-[10vh] w-[200px] hidden lg:block z-10">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-300 dark:bg-gray-800 w-full h-[250px] rounded-lg flex justify-center items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    Ad Space {i + 1}
                  </div>
                ))}
              </div>
            </div>

            <div className="fixed right-2 top-[10vh] w-[200px] hidden lg:block z-10">
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-300 dark:bg-gray-800 w-full h-[250px] rounded-lg flex justify-center items-center text-sm text-gray-600 dark:text-gray-400"
                  >
                    Ad Space {i + 4}
                  </div>
                ))}
              </div>
            </div> */}

            <CommentsContainer />

            <div className="max-w-[900px] mx-auto py-10 px-4 lg:px-0">
              <img src={banner} alt="Banner" className="aspect-video rounded-lg shadow-lg" />

              <div className="mt-8">
                <h2 className="text-3xl font-semibold">{title}</h2>

                <div className="flex justify-between items-center mt-6">
                  <div className="flex gap-4 items-center">
                    <img
                      src={profile_img}
                      alt="profile"
                      className="w-12 h-12 rounded-full shadow"
                    />

                    <p className="capitalize">
                      {fullname}
                      <br />
                      <Link to={`/user/${author_username}`} className="text-blue-600 underline">
                        @{author_username}
                      </Link>
                    </p>
                  </div>
                  <p className="text-gray-500">
                    Published on {getDay(publishedAt)}
                  </p>
                </div>
              </div>

              <BlogInteraction />

              <div className="mt-8 font-gelasio blog-page-content space-y-8">
                {content?.[0]?.blocks?.length > 0 ? (
                  content[0].blocks.map((block, i) => (
                    <div key={i}>
                      <BlogContent block={block} />
                    </div>
                  ))
                ) : (
                  <p>No content available for this blog.</p>
                )}
              </div>

              <BlogInteraction />

              <div className="mt-16">
                <h1 className="text-2xl font-medium">Similar Blogs [Recommended!]</h1>
                <div className="mt-6 space-y-4">
                  {similarBlogs?.length > 0 ? (
                    similarBlogs.map((blog, i) => {
                      const {
                        author: { personal_info },
                      } = blog;

                      return (
                        <AnimationWrapper
                          key={i}
                          transition={{ duration: 1, delay: i * 0.08 }}
                        >
                          <BlogPostCard content={blog} author={personal_info} />
                        </AnimationWrapper>
                      );
                    })
                  ) : (
                    <p>No similar blogs found.</p>
                  )}
                </div>
              </div>

              {/* Ad Space at the Bottom */}
              {/* <div className="mt-12">
                <div className="bg-gray-300 dark:bg-gray-800 w-full h-[200px] rounded-lg flex justify-center items-center text-sm text-gray-600 dark:text-gray-400">
                  Bottom Ad Space
                </div>
              </div> */}
            </div>
          </BlogContext.Provider>
        )}
      </div>
    </AnimationWrapper>
  );
};

export default BlogPage;
