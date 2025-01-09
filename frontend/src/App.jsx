import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Loader from "./components/loader.component.jsx";
import { createContext, useEffect, useState } from "react";
import { lookInCookies } from "./common/session.jsx";
import Footer from "./pages/footer.page.jsx";

const Navbar = lazy(() => import("./components/navbar.component.jsx"));
const UserAuthForm = lazy(() => import("./pages/userAuthForm.page.jsx"));
// const { lookInCookies } = lazy(() => import("./common/session.jsx"));
const Editor = lazy(() => import("./pages/editor.pages.jsx"));
const HomePage = lazy(() => import("./pages/home.page.jsx"));
const SearchPage = lazy(() => import("./pages/search.page.jsx"));
const PageNotFound = lazy(() => import("./pages/404.page.jsx"));
const ProfilePage = lazy(() => import("./pages/profile.page.jsx"));
const BlogPage = lazy(() => import("./pages/blog.page.jsx"));
const SideNav = lazy(() => import("./components/sidenavbar.component.jsx"));
const ChangePassword = lazy(() => import("./pages/change-password.page.jsx"));
const EditProfile = lazy(() => import("./pages/edit-profile.page.jsx"));
const Notifications = lazy(() => import("./pages/notifications.page.jsx"));
const ManageBlogs = lazy(() => import("./pages/manage-blogs.page.jsx"));
const AboutPage = lazy(() => import("./pages/about.page.jsx"));
const PrivacyPolicyPage = lazy(() => import("./pages/privacy-policy.page.jsx"));
const FAQPage = lazy(() => import("./pages/faq.page.jsx"));
const DisclaimerPage = lazy(() => import("./pages/disclaimer.page.jsx"));

// import Navbar from "./components/navbar.component.jsx";
// import UserAuthForm from "./pages/userAuthForm.page.jsx";
// import Editor from "./pages/editor.pages.jsx";
// import HomePage from "./pages/home.page.jsx";
// import SearchPage from "./pages/search.page.jsx";
// import PageNotFound from "./pages/404.page.jsx";
// import ProfilePage from "./pages/profile.page.jsx";
// import BlogPage from "./pages/blog.page.jsx";
// import SideNav from "./components/sidenavbar.component.jsx";
// import ChangePassword from "./pages/change-password.page.jsx";
// import EditProfile from "./pages/edit-profile.page.jsx";
// import Notifications from "./pages/notifications.page.jsx";
// import ManageBlogs from "./pages/manage-blogs.page.jsx";

// import AboutPage from "./pages/about.page.jsx";
// import PrivacyPolicyPage from "./pages/privacy-policy.page.jsx";
// import FAQPage from "./pages/faq.page.jsx";
// import DisclaimerPage from "./pages/disclaimer.page.jsx";

export const UserContext = createContext({});
export const ThemeContext = createContext({});

const darkThemePreference = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  const [theme, setTheme] = useState(() =>
    darkThemePreference() ? "dark" : "light"
  );

  //* Will run at the very start, verfying whether the user is in sesssionStorage or not
  //? if it is there then simply--> setUserAUth(true)/ else (null)
  //*then if it is not there then the work to set it will be done by userAuthForm.jsx (refer to it...)
  useEffect(() => {
    let userInSession = lookInCookies("user");
    let themeInCookies = lookInCookies("theme");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });

    if (themeInCookies) {
      setTheme(() => {
        document.body.setAttribute("data-theme", themeInCookies);

        return themeInCookies;
      });
    } else {
      document.body.setAttribute("data-theme", theme);
    }
  }, []);

  //*reistit once more ....Context!!
  return (
    <Suspense fallback={<Loader />}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserContext.Provider value={{ userAuth, setUserAuth }}>
          <Routes>
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:blog_id" element={<Editor />} />

            <Route path="/" element={<Navbar />}>
            {/* <Route path="/" element={<Footer />}><Route /> */}
              <Route index element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />

              <Route path="dashboard" element={<SideNav />}>
                <Route path="blogs" element={<ManageBlogs />} />
                <Route path="notification" element={<Notifications />} />
              </Route>

              <Route path="settings" element={<SideNav />}>
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
              </Route>

              <Route path="signin" element={<UserAuthForm type="sign-in" />} />
              <Route path="signup" element={<UserAuthForm type="sign-up" />} />
              <Route path="search/:query" element={<SearchPage />} />
              <Route path="user/:id" element={<ProfilePage />} />
              <Route path="blog/:blog_id" element={<BlogPage />} />

              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
          
        </UserContext.Provider>
      </ThemeContext.Provider>
    </Suspense>
  );
};

export default App;
