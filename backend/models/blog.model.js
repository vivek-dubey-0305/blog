import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({

    blog_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,

        // required: true,
    },
    des: {
        type: String,
        maxlength: 200,
        // required: true
    },
    content: {
        type: [],
        // required: true
    },
    tags: {
        type: [String],
        // required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'Comment'
    },
    draft: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: {
            createdAt: 'publishedAt'
        }

    })

// Middleware to ensure the banner URL is HTTPS
blogSchema.pre('save', function (next) {
    if (this.banner && this.banner.startsWith('http://')) {
        this.banner = this.banner.replace('http://', 'https://');
    }
    next();
});


// Indexes
blogSchema.index({ publishedAt: -1 }); // For sorting latest blogs
blogSchema.index({ 'activity.total_reads': -1, 'activity.total_likes': -1 }); // For trending blogs
blogSchema.index({ tags: 1 }); // For category-based search

// export default mongoose.model("blogs", blogSchema);
export const Blog = mongoose.model("Blog", blogSchema);
