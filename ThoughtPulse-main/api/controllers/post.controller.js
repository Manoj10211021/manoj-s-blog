import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    // Check if the user is an admin
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }

    // Check if required fields are present
    const { title, content, category = 'uncategorized', image } = req.body;
    if (!title || !content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }

    // Generate slug from title
    const slug = title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '-')
        .replace(/^-+|-+$/g, '');

    // Create new Post object
    const newPost = new Post({
        title,
        content,
        category,
        image: image || "https://shorturl.at/pIBST",
        slug,
        userId: req.user.id
    });

    try {
        // Save the post to the database
        const savedPost = await newPost.save();
        return res.status(201).json(savedPost);
    } catch (err) {
        // Handle duplicate key error (code 11000)
        if (err.code === 11000) {
            if (err.keyPattern?.title) {
                return next(errorHandler(409, 'Duplicate Post Title'));
            } else if (err.keyPattern?.slug) {
                return next(errorHandler(409, 'Duplicate Slug'));
            }
        }
        next(err);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const {
            startIndex = 0,
            limit = 12,
            order = 'desc',
            userId,
            category,
            slug,
            postId,
            searchTerm
        } = req.query;

        const sortDirection = order === 'asc' ? 1 : -1;
        const filter = {};

        if (userId) filter.userId = userId;
        if (category) filter.category = category;
        if (slug) filter.slug = slug;
        if (postId) filter._id = postId;
        if (searchTerm) {
            filter.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { content: { $regex: searchTerm, $options: 'i' } }
            ];
        }

        const posts = await Post.find(filter)
            .sort({ updatedAt: sortDirection })
            .skip(parseInt(startIndex))
            .limit(parseInt(limit));

        const [totalPosts, lastMonthPosts] = await Promise.all([
            Post.countDocuments(),
            Post.countDocuments({
                createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)) }
            })
        ]);

        return res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        });
    } catch (err) {
        next(err);
    }
};

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to delete this post'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updatepost = async (req, res, next) => {
    if (!req.user || !req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'You are not allowed to update this post'));
    }
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            {
                $set: {
                    title: req.body.title,
                    content: req.body.content,
                    category: req.body.category,
                    image: req.body.image
                }
            }, { new: true }
        )

        return res.status(200).json(updatedPost);

    } catch (err) {
        next(err)
    }
}

export const getpost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.postId)
        return res.status(200).json(post)

    } catch (err) {
        next(err)
    }

}