import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import JWT from "jsonwebtoken";

//Models import..
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { Notification } from "../models/notification.model.js";
import { Comment } from "../models/comment.model.js";
// import { error } from "console";

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


//? TO make the username unique!
const generateUsername = async (email) => {

    let username = email.split("@")[0];


    let isUsernameExist = await User.exists({
        "personal_info.username": username
    })
        .then((result) => result);

    isUsernameExist ? username += nanoid().substring(0, 5) : "";

    return username;
}


//? THe only data from user that is required to be sent to frontend!!
const formatDataToSend = (user) => {

    const access_token = JWT.sign({ id: user._id, admin: user.admin }, process.env.ACCESS_TOKEN_SECRET)
    //*CREATING COOKIE OTIONS
    // const options = {
    //     httpOnly: true,
    //     secure: true,
    //     maxAge: 3 * 60 * 1000,  // 7 days in milliseconds
    //     sameSite: "Strict"      // Helps prevent CSRF attacks
    // }
    return {
        access_token,
        // options,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
        isAdmin: user.admin
    }
}


// ? deleteComment
const deleteComments = (_id) => {
    Comment.findOneAndDelete({ _id })
        .then(comment => {

            if (comment.parent) {
                Comment.findOneAndUpdate(
                    { _id: comment.parent },
                    { $pull: { children: _id } }

                ).then(data => console.log("Comment delete from parent"))
                    .catch(err => console.log("Error at deleteComments", err))
            }

            Notification.findOneAndDelete({ comment: _id })
                .then(notification => console.log("Comment Notification Deleted!"))

            Notification.findByIdAndUpdate({ reply: _id }, { $unset: { reply: 1 } })
                .then(notification => console.log("Reply Notification Deleted!"))

            Blog.findOneAndUpdate(
                { _id: comment.blog_id },
                {
                    $pull: { comments: _id },
                    $inc: {
                        "activity.total_comments": -1,
                        "activity.total_parent_comments": comment.parent ? 0 : -1
                    },

                }
            )
                .then(blog => {
                    if (comment.children.length) {
                        comment.children.map(replies => {
                            deleteComments(replies)
                        })
                    }
                })

        })
        .catch(err => {
            console.log("Error DC", err.message)
        })

}



//* Sign-Up______________________________
const signUp = async (req, res) => {

    let { fullname, email, password } = req.body

    //? Validating the data from frontend
    if (fullname.length < 3) {
        return res.status(403).json({
            "error": "Fullname must be at leat 3 letter long"
        })
    }

    if (!email.length) {
        return res.status(403).json({
            "error": "Enter email"
        })
    }

    if (!emailRegex.test(email)) {
        return res.status(403).json({
            "error": "Email is invalid!"
        })
    }

    if (!passwordRegex.test(password)) {
        return res.status(403).json({
            "error": "Password must be 6 to 20 characters long..... with at least \n1UpperCase\n1LowerCase\n1SpecialCharacter\n1Number"
        })
    }


    //? Hashing the password berfore Saving [This can be don in the models ....using pre save method]
    bcrypt.hash(password, 10, async (err, hashed_password) => {


        let username = await generateUsername(email);

        let user = new User({
            personal_info: {
                fullname, email, password: hashed_password, username
            }
        });


        //? Saving the User data to Database, and returning the user (as for now)!
        await user.save()
            .then((result) => {
                console.log("Saving the user...")
                return res.status(200).json(formatDataToSend(result));
            }).catch((err) => {

                if (err.code == 11000) {
                    return res.status(500).json({
                        "error": "Email already exist!"
                    });
                }
                return res.status(500).json({
                    "error": err.message
                });
            });



    })

    //? If all good, then returning with response "OK"
    // ! ...Cannot send multiple responses to clinet ....only one response
    // return res.status(200).json({
    //     "status": "OK"
    // })
}


//* Sign-In______________________________
const signIn = async (req, res) => {

    let { email, password } = req.body;

    await User.findOne({
        "personal_info.email": email,
    })
        .then((user) => {
            if (!user) {

                return res.status(403).json({
                    "error": "Email Not found"
                })
            }

            bcrypt.compare(password, user.personal_info.password, (err, result_msg) => {
                if (err) {
                    return res.status(403).json({
                        "error": "Error occured while login, Please try after someitme!!"
                    })
                }

                if (!result_msg) {

                    return res.status(403).json({
                        "error": "Incorrect Password!"
                    })
                } else {
                    const access_token = JWT.sign({ id: user._id, admin: user.admin }, process.env.ACCESS_TOKEN_SECRET)
                    //*CREATING COOKIE OTIONS
                    const options = {
                        httpOnly: true,
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000,  // 7 days in milliseconds
                        sameSite: "Strict"      // Helps prevent CSRF attacks
                    }
                    return res.status(200)
                        .cookie("access_token", access_token, options)
                        .json({
                            access_token: access_token,
                            profile_img: user.personal_info.profile_img,
                            username: user.personal_info.username,
                            fullname: user.personal_info.fullname,
                            isAdmin: user.admin
                        })

                }
            })


        }).catch((err) => {
            return res.status(500).json({
                "error": err.message
            })
        });


}



//*uploadImageURL
const uploadImageURL = async (req, res) => {
    console.log("Received file:", req.file);
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        // Upload the image to Cloudinary
        const imageUrl = await uploadOnCloudinary(req.file.buffer);
        console.log("imageUrl:", imageUrl)

        // Send the Cloudinary URL back to the client
        res.status(200).json({ imageUrl });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Failed to upload image" });
    }
};

// *createBlog
const createBlog = async (req, res) => {
    let authorId = req.user;
    let isAdmin = req.admin;
    console.log("Admin :", isAdmin)


    if (isAdmin) {

        let { title, des, banner, tags, content, draft, id } = req.body;

        if (!title.length) {
            return res.status(403).json({ error: "You must provide a title to publish a BLog! " })
        }

        if (!draft) {

            if (!des.length || des.length > 200) {
                return res.status(403).json({ error: "You must provide a descripton to publish a BLog! " })
            }

            if (!banner.length) {
                return res.status(403).json({ error: "You must provide a banner to publish a BLog! " })
            }

            if (!content.blocks.length) {
                return res.status(403).json({ error: "You must provide a Content to publish a BLog! " })
            }

            if (!tags.length || tags.length > 10) {
                return res.status(403).json({ error: "You must provide a tags(10) to publish a BLog! " })
            }
        }
        tags = tags.map(tag => tag.toLowerCase());
        let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, " ").replace(/\s+/g, "-").trim() + nanoid();



        if (id) {
            Blog.findOneAndUpdate({ blog_id }, { title, des, banner, content, tags, draft: draft ? draft : false })
                .then(blog => {
                    return res.status(200).json({
                        id: blog_id
                    })
                })
                .catch(err => {
                    return res.status(500).json({
                        error: err.message
                    })
                })
        }
        else {
            //*Saving the blog in the blog model
            let blog = new Blog({
                title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
            })



            await blog.save().then(async (blog) => {
                let incrementVal = draft ? 0 : 1;

                await User.findOneAndUpdate(
                    { _id: authorId },
                    {
                        $inc: { "account_info.total_posts": incrementVal },
                        $push: { "blogs": blog._id }
                    },
                    { new: true }
                )
                    .then(user => {
                        console.log("SEding respONSE...")
                        return res.status(200).json({
                            id: blog.blog_id
                        })
                    })
                    .catch(err => {

                        return res.status(500).json({
                            error: "Failed to update total post number"
                        })
                    })
            })
                .catch(err => {
                    return res.status(500).json({
                        error: err.message
                    })
                })
        }

    } else {
        return res.status(403).json({
            error: "You do not have any permission to write the blog, you aren't admin!"
        })
    }

}


// *Latest Blogs
const latestBlogs = async (req, res) => {

    const { page } = req.body
    if (!page || isNaN(page) || page < 1) {
        return res.status(400).json({ error: "Invalid page number" });
    }
    let maxLimit = 5;
    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .lean()
        .exec()
        // Ensure all banner URLs are HTTPS

        .then(blogs => {
            blogs.forEach(blog => {
                if (blog.banner.startsWith("http://")) {
                    blog.banner = blog.banner.replace("http://", "https://");
                }
            });
console.log(blogs)
            return res.status(200).json({
                blogs
            })
        }).catch(err => {

            return res.status(500).json({
                error: err.message
            })
        })
}

// *TrendingBlogs
const trendingBlogs = async (req, res) => {
    let maxLimit = 5;
    Blog.find({ draft: false })
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "activity.total_reads": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title des publishedAt -_id")
        .limit(maxLimit)
        .then(blogs => {

            return res.status(200).json({
                blogs
            })
        }).catch(err => {

            return res.status(500).json({
                error: err.message
            })
        })
}

// *Search Blogs
const searchBlogs = async (req, res) => {
    let { tag, page, query, author, limit, eliminate_blog } = req.body
    let maxLimit = limit ? limit : 3

    let findQuery;

    if (tag) {
        findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } }

    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, "i") }
    } else if (author) {
        findQuery = { author, draft: false }
    }



    Blog.find(findQuery)
        .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then(blogs => {

            return res.status(200).json({
                blogs
            })
        }).catch(err => {

            return res.status(500).json({
                error: err.message
            })
        })
}


// *countAllLatestBlogs
const countAllLatestBlogs = async (req, res) => {
    await Blog.countDocuments({ draft: false }).exec()
        .then(count => {
            return res.status(200).json({
                totalDocs: count
            })
        })
        .catch(err => {

            return res.status(500).json({
                error: err.message
            })
        })
}


// *countAllSearchBlogs
const countAllSearchBlogs = async (req, res) => {
    let { tag, query, author } = req.body
    let findQuery;



    if (tag) {
        findQuery = { tags: tag, draft: false }

    } else if (query) {
        findQuery = { draft: false, title: new RegExp(query, "i") }
    } else if (author) {
        findQuery = { author, draft: false }
    }


    Blog.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({
                totalDocs: count
            })
        })
        .catch(err => {

            return res.status(500).json({
                err: err.message
            })
        })
}


// *searchUsers
const searchUsers = async (req, res) => {
    let { query } = req.body;

    User.find({
        "personal_info.username": new RegExp(query, "i")
    })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then(users => {
            return res.status(200).json({
                users
            })
        })
        .catch(err => {

            return res.status(500).json({
                error: err.message
            })
        })
}

// *getProfile
const getProfile = async (req, res) => {
    let { username } = req.body;


    await User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -updatedAt -blogs")
        .then(user => {

            return res.status(200).json({ user })
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            })
        })
}


// *getBlog
const getBlog = async (req, res) => {
    let { blog_id, draft, mode } = req.body
    console.log(req.body)

    let incrementVal = mode != "edit" ? 1 : 0

    

    await Blog.findOneAndUpdate(
        {
            blog_id
        },
        { $inc: { "activity.total_reads": incrementVal } }

    )
        .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
        .select("title des content banner activity publishedAt blog_id tags")
        .then(async (blog) => {
            console.log("blog:fffffffffffffff", blog.banner)

            try {
                await User.findOneAndUpdate(
                    { "personal_info.username": blog.author.personal_info.username },
                    { $inc: { "account_info.total_reads": incrementVal } }
                )
                console.log("account_info.total_reads",incrementVal)
            } catch (error) {
                console.log(error)
            }

            if (blog.draft && !draft) {
                return res.status(500).json({ error: "You cannot access draft blogs" })
            }
            return res.status(200).json({ blog })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}

// const getBlog = async (req, res) => {
//     let { blog_id, draft, mode } = req.body;
//     console.log(req.body);
//     const user_id = req.user
//     console.log("user_id:", user_id)
//     let incrementVal = mode !== "edit" ? 1 : 0;

//     try {
//         // Fetch the blog first to check the author
//         const blog = await Blog.findOne({ blog_id })
//             .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
//             .select("title des content banner activity publishedAt blog_id tags author draft");

//         if (!blog) {
//             return res.status(404).json({ error: "Blog not found" });
//         }

//         console.log("blog.author._id:",blog.author._id)

//         // If the requesting user is the author, do not increment read count
//         if (String(req.user) === String(blog.author._id)) {
//             console.log("Blog accessed by its owner. No read count update.");
//             return res.status(200).json({ blog });
//         }

//         // Increment blog activity and user account stats
//         if (incrementVal === 1) {
//             await Blog.findOneAndUpdate(
//                 { blog_id },
//                 { $inc: { "activity.total_reads": incrementVal } }
//             );

//             await User.findOneAndUpdate(
//                 { _id: blog.author._id },
//                 { $inc: { "account_info.total_reads": incrementVal } }
//             );

//             console.log("Read count updated for blog and author.");
//         }

//         // If the blog is a draft and the draft flag is not set, return an error
//         if (blog.draft && !draft) {
//             return res.status(403).json({ error: "You cannot access draft blogs" });
//         }

//         // Return the blog data
//         return res.status(200).json({ blog });

//     } catch (err) {
//         console.error(err);
//         return res.status(500).json({ error: err.message });
//     }
// };


// *likeBlog
const likeBlog = async (req, res) => {
    try {

        let user_id = req.user
        let { _id } = req.body

        // Check if the user has already liked the blog
        const existingNotification = await Notification.findOne({
            user: user_id,
            type: "like",
            blog: _id,
        });

        // let incrementVal = !islikedByUser ? 1 : -1

        let incrementVal = existingNotification ? -1 : 1;


        //* Update the blog's total_likes
        const updatedBlog = await Blog.findOneAndUpdate(
            { _id },
            { $inc: { "activity.total_likes": incrementVal } },
            { new: true } // Returns the updated blog document
        )
        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }


        if (incrementVal > 0) {
            // Add a like notification
            const likeNotification = new Notification({
                type: "like",
                blog: _id,
                notification_for: updatedBlog.author,
                user: user_id,
            });


            await likeNotification.save()

        }
        else {
            await Notification.findOneAndDelete({
                user: user_id,
                type: "like",
                blog: _id
            })


        }
        // Send a single response indicating success
        return res.status(200).json({
            liked_by_user: incrementVal > 0,
            total_likes: updatedBlog.activity.total_likes,
        });
    }

    catch (err) {

        // return res.status(500).json({ error: err.message });
        res.status(500).json({ error: "An error occurred while liking the blog." });
    }
}



// isLikedByUser
const isLikedByUser = async (req, res) => {
    let user_id = req.user
    let { _id } = req.body

    Notification.exists({ user: user_id, type: "like", blog: _id })
        .then(result => {
            return res.status(200).json({
                result
            })
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })
}


// *addComment
const addComment = async (req, res) => {
    let user_id = req.user
    let { _id, comment, blog_author, replying_to, notification_id } = req.body

    if (!comment.length) {
        return res.status(403).json({ error: "Write something to leave comment" })
    }


    let commentObj = {
        blog_id: _id, blog_author, comment, commented_by: user_id, isReply: false
    }

    if (replying_to) {
        commentObj.parent = replying_to;
        commentObj.isReply = true
    }

    new Comment(commentObj).save().then(async (commentFile) => {
        let { comment, commentedAt, children } = commentFile

        await Blog.findByIdAndUpdate(
            { _id },
            {
                $push: { "comments": commentFile._id },
                $inc: {
                    "activity.total_comments": 1,
                    "activity.total_parent_comments": replying_to ? 0 : 1
                },

            })
            .then(blog => { console.log("New Comment created") })

        let notificationObj = {
            type: replying_to ? "reply" : "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentFile._id
        }

        if (replying_to) {
            notificationObj.replied_on_comment = replying_to

            await Comment.findOneAndUpdate(
                { _id: replying_to },
                { $push: { children: commentFile._id } }
            )
                .then(replyingToCommentDoc => {
                    notificationObj.notification_for = replyingToCommentDoc.commented_by
                })

            if (notification_id) {
                Notification.findByIdAndUpdate({ _id: notification_id }, { reply: commentFile._id })
                    .then(notification => {
                        console.log("Notifcation Update..!")
                    })
            }
        }

        new Notification(notificationObj).save()
            .then(notification =>
                console.log("New notificaiton created!")
            )

        return res.status(200).json({
            comment, commentedAt, _id: commentFile._id, user_id, children
        })
    })

}


// *getBlogComments
const getBlogComments = async (req, res) => {

    let { blog_id, skip } = req.body

    let maxLimit = 5

    Comment.find({ blog_id, isReply: false })
        .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
        .skip(skip)
        .limit(maxLimit)
        .sort({
            "commentedAt": -1
        })
        .then(comment => {
            return res.status(200).json(comment)
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).json({
                error: err.message
            })
        })
}


// *getReplies
const getReplies = async (req, res) => {

    let { _id, skip } = req.body

    let maxLimit = 5

    Comment.findOne({ _id })
        .populate({
            path: "children",
            options: {
                limit: maxLimit,
                skip: skip,
                sort: { "commentedAt": -1 }
            },
            populate: {
                path: "commented_by",
                select: "personal_info.profile_img personal_info.fullname personal_info.username"
            },
            select: "-blog_id -updatedAt"
        })
        .select("children")
        .then(doc => {
            return res.status(200).json({ replies: doc.children })
        })
        .catch(err => {
            console.log("Error at getReplies", err.message)
            return res.status(500).json({
                error: err.message
            })
        })

}


// *deleteComment
const deleteComment = async (req, res) => {

    let user_id = req.user
    let { _id } = req.body

    Comment.findOne({ _id })
        .then(comment => {
            if (user_id == comment.commented_by || user_id == comment.blog_author) {
                deleteComments(_id)
                return res.status(200).json({
                    status: "Okay!"
                })
            }
            else {
                return res.status(403).json({
                    error: "You can not delete The comment (as you aren't the owner of the post or the one who commented!)"
                })
            }
        })
}


// *changeCurrentPassword
const changeCurrentPassword = async (req, res) => {
    let { currentPassword,
        newPassword } = req.body


    // if (!currentPassword.length || !newPassword.length) {
    //     return toast.error("Fill alll the inputs");
    // }

    if (
        !passwordRegex.test(currentPassword) ||
        !passwordRegex.test(newPassword)
    ) {
        return res.stauts(403).json({
            error: "Password must be 6 to 20 characters long with [1.numeric, 1.Capital, 1.Lower, 1.Special!]"

        }
        );
    }

    await User.findOne({ _id: req.user })
        .then((user) => {
            if (user.google_auth) {
                return res.status(403).json({
                    error: "You can't change account's password because you logged in through Google!"
                })
            }

            bcrypt.compare(currentPassword, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        error: "Some error occured while changing the password!, Please try again later"
                    })
                }

                if (!result) {
                    return res.status(403).json({
                        error: "Incorrect Current Password"
                    })
                }

                bcrypt.hash(newPassword, 10, async (err, hashed_password) => {
                    await User.findByIdAndUpdate(
                        { _id: req.user },
                        { "personal_info.password": hashed_password }
                    )
                        .then((u) => {
                            return res.status(200).json({
                                status: "Password Changed!"
                            })
                        })
                        .catch(err => {
                            return res.status(500).json({
                                error: "Some error occured while saving new password"
                            })
                        })

                })

            })
        })
        .catch(err => {
            return res.status(500).json({
                error: "Some error occured while saving new password"
            })

        })

}



// *updateProfileImg
const updateProfileImg = async (req, res) => {


    let { url } = req.body

    User.findOneAndUpdate({ _id: req.user }, { "personal_info.profile_img": url })
        .then(() => {
            return res.status(200).json({
                profile_img: url
            })
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            })
        })
}


// *updateProfile
const updateProfile = async (req, res) => {
    let bioLimit = 150

    let { username, bio, social_links } = req.body
    if (username.length < 3) {
        return res.status(403).json({ error: "Username should be at least 3 character long" });
    }

    if (bio.length > bioLimit) {
        return res.status(403).json({ error: `Bio limit must not be more than ${bioLimit}` });
    }

    let socialLinksArr = Object.keys(social_links)

    try {

        for (let i = 0; i < socialLinksArr.length; i++) {
            if (social_links[socialLinksArr[i]].length) {
                let hostname = new URL(social_links[socialLinksArr[i]]).hostname

                if (!hostname.includes(`${socialLinksArr[i]}.com`) && socialLinksArr[i] != "website") {
                    return res.status(403).json({
                        error: `${socialLinksArr[i]} link is invalid. You must enter a full link`
                    })
                }


            }
        }

    } catch (error) {
        return res.status(500).json({
            error: "You must provide full links with http(s) included"
        })
    }

    let updateObj = {
        "personal_info.username": username,
        "personal_info.bio": bio,
        social_links
    }

    User.findOneAndUpdate({ _id: req.user },
        updateObj,
        { runValidators: true }
    )
        .then(() => {
            return res.status(200).json({ username })
        }).catch(err => {
            if (err.code == 1100) {
                return res.status(409).json({
                    error: "Username is already taken!, try unique"
                })
            }
            return res.status(500).json({
                error: err.message
            })
        })


}


// *newNotification

const newNotification = async (req, res) => {
    let user_id = req.user
    // console.log(user_id)


    await Notification.exists(
        {
            notification_for: user_id,
            seen: false,
            user: { $ne: user_id }
        }
    )


        .then(result => {
            if (result) {
                // console.log("rsult:", result)
                return res.status(200).json({ new_notification_available: true })
            }
            else {
                // console.log("unauth")
                return res.status(200).json({ new_notification_available: false })

            }
        })

        .catch(err => {
            console.log("err.message")
            return res.status(500).json({ error: err.message })

        })
}


// *allNotifications
const allNotifications = async (req, res) => {

    // let user_id = req.id
    let user_id = req.user


    let { page, filter, deletedDocCount } = req.body
    let maxLimit = 10

    let findQuery = { notification_for: user_id, user: { $ne: user_id } }

    let skipDocs = (page - 1) * maxLimit


    if (filter != "all") {
        findQuery.type = filter
    }


    if (deletedDocCount) {
        skipDocs -= deletedDocCount
    }


    await Notification.find(findQuery)
        .skip(skipDocs)
        .limit(maxLimit)
        .populate("blog", "title blog_id")
        .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
        .populate("comment", "comment")
        .populate("replied_on_comment", "comment")
        .populate("reply", "comment")
        .sort({ createdAt: -1 })
        .select("createdAt type seen reply")
        .then(notifications => {

            Notification.updateMany(findQuery, { seen: true })
                .skip(skipDocs)
                .limit(maxLimit)
                .then(() => console.log("Notification Seen !"))

            return res.status(200).json({ notifications })
        })
        .catch(err => {
            console.log(err.message)
            return res.status(500).json({
                error: err.message
            })
        })


}



// *allNotificationsCount
const allNotificationsCount = async (req, res) => {
    let user_id = req.user

    let { filter } = req.body

    let findQuery = { notification_for: user_id, user: { $ne: user_id } }

    if (filter != "all") {
        findQuery.type = filter
    }


    Notification.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            })
        })

}


// *manageUserWrittenBlogs
const manageUserWrittenBlogs = async (req, res) => {

    let user_id = req.user

    let { page, draft, query, deletedDocCount } = req.body

    let maxLimit = 5
    let skipDocs = (page - 1) * maxLimit

    if (deletedDocCount) {
        skipDocs -= deletedDocCount
    }

    Blog.find({
        author: user_id,
        draft,
        title: new RegExp(query, "i")
    })
        .skip(skipDocs)
        .limit(maxLimit)
        .sort({ publishedAt: -1 })
        .select("title banner publishedAt blog_id activity des draft -_id")
        .then(blogs => {
            return res.status(200).json({ blogs })
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            })
        })


}



// *
const countUserWrittenBlogs = async (req, res) => {

    let user_id = req.user

    let { query, draft } = req.body

    Blog.countDocuments({
        author: user_id,
        draft,
        title: new RegExp(query, "i")
    })
        .then(count => {
            return res.status(200).json({ totalDocs: count })
        })
        .catch(err => {
            return res.status(500).json({
                error: err.message
            })
        })


}



// *deleteBlog
const deleteBlog = async (req, res) => {

    let user_id = req.user
    let isAdmin = req.admin;
    let { blog_id } = req.body

    console.log("BLOGID", blog_id)


    if (isAdmin) {

        Blog.findOneAndDelete({ blog_id })
            .then(blog => {

                Notification.deleteMany({ blog: blog._id }).then(data => console.log("Notifications deleted")).catch(err => console.log(err.message))

                Comment.deleteMany({ blog: blog._id }).then(data => console.log("Comments deleted")).catch(err => console.log(err.message))

                User.findByIdAndUpdate(
                    { _id: user_id },
                    {
                        $pull: { blog: blog._id },
                        $inc: { "account_info.total_posts": -1 }
                    }

                )
                    .then(user => console.log("Blog Deleted"))
                    .catch(err => console.log(err.message))

                return res.status(200).json({
                    status: "done"
                })
            })
            .catch(err => {
                return res.status(500).json({
                    error: err.message
                })
            })

    }
    else {
        return res.status(403).json({
            error: "You do not have any permission to delete the blog, you aren't admin!"
        })
    }



}
// *Export
export {
    signUp,
    signIn,
    uploadImageURL,
    createBlog,
    latestBlogs,
    trendingBlogs,
    searchBlogs,
    countAllLatestBlogs,
    countAllSearchBlogs,
    searchUsers,
    getProfile,
    getBlog,
    likeBlog,
    isLikedByUser,
    addComment,
    getBlogComments,
    getReplies,
    deleteComment,
    changeCurrentPassword,
    updateProfileImg,
    updateProfile,
    newNotification,
    allNotifications,
    allNotificationsCount,
    manageUserWrittenBlogs,
    countUserWrittenBlogs,
    deleteBlog

}