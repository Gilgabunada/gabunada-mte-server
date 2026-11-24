const Blog = require("../models/Blog");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Blog.find()
      .populate("author", "username firstName lastName")
      .sort({ createdAt: -1 });
    return res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch posts.", error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id)
      .populate("author", "username firstName lastName")
      .populate("comments.user", "username");

    if (!post) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    return res.status(200).json({ post });
  } catch (err) {
    return res.status(400).json({ message: "Invalid post ID or fetch error.", error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    const post = await Blog.create({
      title,
      content,
      author: req.user.id
    });

    return res.status(201).json({ message: "Blog post created.", post });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create post.", error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Only the post author can update this post." });
    }

    if (req.body.title !== undefined) post.title = req.body.title;
    if (req.body.content !== undefined) post.content = req.body.content;

    const updatedPost = await post.save();
    return res.status(200).json({ message: "Blog post updated.", post: updatedPost });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update post.", error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    const isOwner = post.author.toString() === req.user.id;
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post." });
    }

    await post.deleteOne();
    return res.status(200).json({ message: "Blog post deleted." });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete post.", error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Comment text is required." });
    }

    const post = await Blog.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Blog post not found." });
    }

    post.comments.push({
      user: req.user.id,
      username: req.user.username,
      text
    });

    await post.save();
    return res.status(201).json({ message: "Comment added.", comments: post.comments });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add comment.", error: err.message });
  }
};