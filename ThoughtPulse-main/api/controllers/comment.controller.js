import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;
        // Validate input
        if (!content || !postId || !userId) {
            return next(errorHandler(400, 'All fields are required.'));
        }

        // Ensure the userId matches the authenticated user
        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You are NOT allowed to create this comment.'));
        }

        // Create and save the new comment
        const newComment = new Comment({
            content,
            postId,
            userId
        });
        await newComment.save();
        return res.status(200).json(newComment);
    } catch (err) {
        next(err);
    }
};

export const getPostComment = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1, })
        return res.status(200).json(comments)
    }
    catch (err) {
        next(err)
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found'));
        }

        const userIndex = comment.likes.indexOf(req.user.id);

        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes = Math.max(comment.numberOfLikes - 1, 0); // Ensure numberOfLikes doesn't go negative
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();

        return res.status(200).json({
            _id: comment._id,
            likes: comment.likes,
            numberOfLikes: comment.numberOfLikes
        });

    } catch (err) {
        next(err);
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'))
        }
        if (comment.userId !== req.user.id) {
            return next(errorHandler(403, 'You are not allowed to edit this comment'))
        }
        const editedComment = await Comment.findByIdAndUpdate(
            req.params.commentId,
            {
                content: req.body.content
            },
            { new: true }
        )

        return res.status(200).json(editedComment)

    } catch (err) {
        next(err)
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Comment not found!'))
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'You are not allowed to delete this comment'))
        }

        await Comment.findByIdAndDelete(req.params.commentId);
        return res.status(200).json("Comment has been deleted")

    } catch (err) {
        next(err)

    }
}

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin)
        return next(errorHandler(403, 'You are not allowed to get all comments'));
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        return res.status(200).json({ comments, totalComments, lastMonthComments });

    } catch (err) {
        next(err);
    }
};