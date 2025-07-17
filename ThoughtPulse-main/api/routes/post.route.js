import express from "express";
import {
  create,
  deletepost,
  getpost,
  getposts,
  updatepost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getPostsByCategory,
  getPostsByUser,
} from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create a new post
router.post("/create", verifyToken, create);

// Get all posts
router.get("/getposts", getposts);

// Get posts by category
router.get("/category/:category", getPostsByCategory);

// Get posts by user
router.get("/user/:userId", getPostsByUser);

// Get a single post by ID
router.get("/:postId", getpost);

// Update a post
router.put("/updatepost/:postId/:userId", verifyToken, updatepost);

// Delete a post
router.delete("/deletepost/:postId/:userId", verifyToken, deletepost);

// Like a post
router.post("/like/:postId", verifyToken, likePost);

// Unlike a post
router.post("/unlike/:postId", verifyToken, unlikePost);

// Add a comment to a post
router.post("/comment/:postId", verifyToken, addComment);

// Delete a comment from a post
router.delete("/comment/:postId/:commentId", verifyToken, deleteComment);
