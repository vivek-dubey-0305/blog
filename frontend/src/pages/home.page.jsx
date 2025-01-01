import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoStateMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
import { Link } from "react-router-dom";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendinBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");

  let categories = [
    "programming",
    "hollywood",
    "film making",
    "technology",
    "gaming",
    "social media",
    "cooking",
    "finances",
    "travel",
    "cyber security",
    "happy",
  ];

  const fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blogs-count",
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
      .then(({ data }) => {
        setTrendinBlogs(data.blogs);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const fetchBlogByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatedData = await filterPaginationData({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    activeTabRef.current.click();
    if (pageState == "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchBlogByCategory({ page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  const loadBlogByCategory = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogs(null);
    if (pageState == category) {
      setPageState("home");
      return;
    }
    setPageState(category);
  };

  return (
    <AnimationWrapper>
      <section className="min-h-screen flex justify-center gap-10 px-4 md:px-8 py-8">
        {/* Main Content */}
        <div className="w-full max-w-4xl">
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            {/* Latest Blogs Section */}
            <div className="space-y-8">
              {blogs == null ? (
                <Loader />
              ) : blogs?.results?.length ? (
                blogs?.results?.map((blog, i) => (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="transform hover:scale-[1.02] transition-transform duration-300">
                      <BlogPostCard
                        content={blog}
                        author={blog?.author?.personal_info}
                      />
                    </div>
                  </AnimationWrapper>
                ))
              ) : (
                <NoStateMessage message="No blogs published yet in this category!" />
              )}

              <LoadMoreDataBtn
                state={blogs}
                fetchDataFun={
                  pageState == "home" ? fetchLatestBlogs : fetchBlogByCategory
                }
              />
            </div>

            {/* Trending Blogs Section */}
            <div className="space-y-6">
              {trendingBlogs == null ? (
                <Loader />
              ) : trendingBlogs?.length ? (
                trendingBlogs.map((blog, i) => (
                  <AnimationWrapper
                    key={i}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <div className="transform hover:scale-[1.05] transition-transform duration-300 p-4 rounded-lg shadow-sm hover:shadow-md">
                      <MinimalBlogPost blog={blog} index={i} />
                    </div>
                  </AnimationWrapper>
                ))
              ) : (
                <NoStateMessage message="No trending blogs available!" />
              )}
            </div>
          </InPageNavigation>
        </div>

        {/* Sidebar */}
        <div className="min-w-[320px] lg:min-w-[400px] max-w-md border-l border-gray-100 pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-12 sticky top-24">
            {/* Links Section */}
            <div className="space-y-4">
              <Link
                to="/about"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                About
              </Link>
              <Link
                to="/privacy-policy"
                className="text-sm font-medium text-blue-600 hover:underline ml-4"
              >
                Privacy Policy
              </Link>

              <Link
                to="/faq"
                className="text-sm font-medium text-blue-600 hover:underline ml-4"
              >
                FAQ's
              </Link>
            </div>

            {/* Categories Section */}
            <div className="space-y-1">
              <h1 className="font-medium text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Explore Categories
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => (
                  <button
                    onClick={loadBlogByCategory}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      pageState == category
                        ? "bg-black text-white shadow-lg transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                    key={i}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div className="space-y-6">
              <h1 className="font-medium text-2xl flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Trending
                <i className="fi fi-rr-arrow-trend-up text-orange-500"></i>
              </h1>
              <div className="space-y-4">
                {trendingBlogs == null ? (
                  <Loader />
                ) : trendingBlogs?.length ? (
                  trendingBlogs.map((blog, i) => (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <div className="transform hover:scale-[1.05] transition-transform duration-300 hover:shadow-md rounded-lg bg-white p-4">
                        <MinimalBlogPost blog={blog} index={i} />
                      </div>
                    </AnimationWrapper>
                  ))
                ) : (
                  <NoStateMessage message="No trending blogs yet!" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="flex justify-center items-center py-4 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
  &copy; {new Date().getFullYear()} InsightfulBlogs. All rights reserved.
</div>

    </AnimationWrapper>
  );
};

export default HomePage;
