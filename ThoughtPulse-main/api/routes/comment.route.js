import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getcomments,
  getPostComment,
  likeComment,
  unlikeComment,
  getUserComments,
} from "../controllers/comment.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

// Create a new comment
router.post("/create", verifyToken, createComment);

// Get all comments for a specific post
router.get("/getpostcomments/:postId", getPostComment);

// Like a comment
router.put("/likecomment/:commentId", verifyToken, likeComment);

// Unlike a comment
router.put("/unlikecomment/:commentId", verifyToken, unlikeComment);

// Edit a comment
router.put("/editcomment/:commentId", verifyToken, editComment);

// Delete a comment
router.delete("/deletecomment/:commentId", verifyToken, deleteComment);

// Get all comments (admin or for moderation)
router.get("/getcomments", verifyToken, getcomments);

// Get all comments by a specific user
router.get("/user/:userId", verifyToken, getUserComments);
