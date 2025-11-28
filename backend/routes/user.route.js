import { Router } from "express";
import { signUp, signIn, uploadImageURL, createBlog, latestBlogs, searchBlogs, trendingBlogs, countAllLatestBlogs, countAllSearchBlogs, searchUsers, getProfile, getBlog, likeBlog, isLikedByUser, addComment, getBlogComments, getReplies, deleteComment, changeCurrentPassword, updateProfileImg, updateProfile, newNotification, allNotifications, allNotificationsCount, manageUserWrittenBlogs, countUserWrittenBlogs, deleteBlog } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/signup").post(signUp);
router.route("/signin").post(signIn);

//image
router.route("/get-upload-url").post(upload.single("image"), uploadImageURL);

router.route("/create-blog").post(verifyJWT, createBlog)


router.route("/latest-blogs").post(latestBlogs)
router.route("/trending-blogs").get(trendingBlogs)

// search, filter.. [Blog]
router.route("/search-blogs").post(searchBlogs)

// Count-(latest/search)-blogs
router.route("/all-latest-blogs-count").post(countAllLatestBlogs)
router.route("/search-blogs-count").post(countAllSearchBlogs)

// Search USers
router.route("/search-users").post(searchUsers)

// getProfile
router.route("/get-profile").post(getProfile)


// BLOGPAGE
router.route("/get-blog").post( getBlog)

// like

router.route("/like-blog").post(verifyJWT, likeBlog)
router.route("/isliked-by-user").post(verifyJWT, isLikedByUser)

// Comment
router.route("/add-comment").post(verifyJWT, addComment)
router.route("/get-blog-comments").post(getBlogComments)


// getReplies
router.route("/get-replies").post(getReplies)


// deleteComents
router.route("/delete-comment").post(verifyJWT, deleteComment)


// ChangePassword
router.route("/change-password").post(verifyJWT, changeCurrentPassword);


// UPdate Profile image url
router.route("/update-profile-img").post(verifyJWT, updateProfileImg)



// updateProfile
router.route("/update-profile").post(verifyJWT, updateProfile)


// Notification
router.route("/new-notification").post(verifyJWT, newNotification)

router.route("/notifications").post(verifyJWT, allNotifications)

router.route("/all-notifications-count").post(verifyJWT, allNotificationsCount)




// ManageBlogs
router.route("/user-written-blogs").post(verifyJWT, manageUserWrittenBlogs)

router.route("/user-written-blogs-count").post(verifyJWT, countUserWrittenBlogs)



//DeleteBlog

router.route("/delete-blog").post(verifyJWT, deleteBlog)


export default router;