const express = require("express");
const router = express.Router();
const { verifyToken } = require("../auth.js");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment
} = require("../controllers/blog.js");

router.get("/", getAllPosts);
router.get("/:id", getPostById);
router.post("/", verifyToken, createPost);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.post("/:id/comments", verifyToken, addComment);

module.exports = router;