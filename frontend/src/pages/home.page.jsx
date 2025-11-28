import { lazy, useContext, useEffect, useState } from "react";
import axios from "axios";

import { activeTabRef } from "../components/inpage-navigation.component.jsx";
import { filterPaginationData } from "../common/filter-pagination-data";
import { ThemeContext } from "../App";

const AnimationWrapper = lazy(() => import("../common/page-animation.jsx"));
// import AnimationWrapper from "../common/page-animation";

const InPageNavigation = lazy(() =>
  import("../components/inpage-navigation.component.jsx")
);
// import InPageNavigation from "../components/inpage-navigation.component";

const Loader = lazy(() => import("../components/loader.component.jsx"));
// import Loader from "../components/loader.component";

const BlogPostCard = lazy(() =>
  import("../components/blog-post.component.jsx")
);
// import BlogPostCard from "../components/blog-post.component";

const MinimalBlogPost = lazy(() =>
  import("../components/nobanner-blog-post.component.jsx")
);
// import MinimalBlogPost from "../components/nobanner-blog-post.component";

const NoStateMessage = lazy(() => import("../components/nodata.component.jsx"));
// import NoStateMessage from "../components/nodata.component";

const LoadMoreDataBtn = lazy(() =>
  import("../components/load-more.component.jsx")
);
// import LoadMoreDataBtn from "../components/load-more.component";

const Footer = lazy(() => import("./footer.page.jsx"));
// import Footer from "./footer.page";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendinBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");

  let { theme } = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(false);
  let categories = [
    "programming",
    "technology",
    "gaming",
    "social media",
    "finances",
    "cyber security",
    "python",
    "AI"
  ];

  const fetchLatestBlogs = async ({ page = 1 }) => {
    try {
      const { data } = await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", { page });
      // console.log(data)
      let formatedData = await filterPaginationData({
        state: blogs,
        data: data.blogs,
        page,
        countRoute: "/all-latest-blogs-count",
      });
      setBlogs(formatedData);
    } catch (error) {
      console.error("Error-", error);
    }
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
    setIsOpen(false);
  };

  return (
    <AnimationWrapper>
      <section className="min-h-screen flex justify-center gap-10 px-4 md:px-8 py-8">
        {/* Main Content */}
        <div className="w-full max-w-4xl">
          {/* <div className="right-0">CATEGORIES</div>/ */}
          <div className="sm:inline-block md:hidden lg:hidden">
            {/* Toggle Button */}
            <div
              className={`absolute right-0 p-4 cursor-pointer ${
                theme == "dark"
                  ? "bg-gray-800 text-rose-50"
                  : "bg-slate-50 text-black"
              } rounded z-10`}
              onClick={() => setIsOpen(!isOpen)}
            >
              CATEGORIES
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
              <div
                className={`absolute right-0 mt-12 w-48 bg-white shadow-lg rounded border border-gray-300 z-10`}
              >
                <ul className="py-2">
                  {categories.map((category, index) => (
                    <li
                      key={index}
                      className={`px-4 py-2 text-sm ${
                        theme == "dark"
                          ? "bg-gray-800 text-rose-50 hover:bg-gray-700"
                          : "bg-slate-50 text-black hover:bg-gray-100"
                      } cursor-pointer`}
                      // onClick={() => {
                      //   // setIsOpen(false);
                      //   // alert(`Selected Category: ${category}`);
                      //   onClick={loadBlogByCategory}
                      // }}
                      onClick={loadBlogByCategory}
                    >
                      {category}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* inPageNAv */}
          <InPageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            {/* Latest Blogs Section */}
            <div className="space-y-8">
              {blogs == null ? (
                <Loader />
              ) : // <div>efe</div>
              blogs?.results?.length ? (
                blogs.results.map((blog, i) => (
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
            {/* <div className="space-y-4">
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
            </div> */}

            {/* Categories Section */}
            <div className="space-y-1">
              <h1 className="font-medium text-2xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Explore Categories
              </h1>
              <div className="flex gap-3 flex-wrap">
                {categories.map((category, i) => (
                  <button
                    onClick={loadBlogByCategory}
                    className={`px-4 py-2 rounded-full text-lg font-medium transition-all duration-300 ${
                      pageState == category
                        ? theme == "dark"
                          ? "bg-gray-900 text-rose-50 shadow-lg transform scale-110"
                          : "bg-black text-white shadow-lg transform scale-110"
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
      {/* <div className="flex justify-center items-center py-4 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400">
  &copy; {new Date().getFullYear()} InsightfulBlogs. All rights reserved.
</div> */}

      <Footer />
    </AnimationWrapper>
  );
};

export default HomePage;
