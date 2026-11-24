const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true
    }
  },
  { timestamps: true }
);

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true
    },
    content: {
      type: String,
      required: [true, "Post content is required"]
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comments: [commentSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);