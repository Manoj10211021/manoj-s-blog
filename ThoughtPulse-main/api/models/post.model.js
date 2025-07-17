import mongoose from "mongoose";

// Helper function to generate slug from title
function generateSlug(title) {
    return title
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with -
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
}

const postSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
            maxlength: 150
        },
        content: {
            type: String,
            required: true,
            minlength: 10
        },
        image: {
            type: String,
            default: "https://shorturl.at/pIBST"
        },
        category: {
            type: [String],
            default: ['uncategorized'],
            validate: [arr => arr.length > 0, 'At least one category is required.']
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        likes: {
            type: [String], // Array of userIds who liked
            default: []
        },
        comments: [
            {
                userId: { type: String, required: true },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    { timestamps: true }
);

// Pre-save middleware to auto-generate slug if not provided
postSchema.pre('validate', function (next) {
    if (!this.slug && this.title) {
        this.slug = generateSlug(this.title);
    }
    next();
});

const Post = mongoose.model('Post', postSchema);

export