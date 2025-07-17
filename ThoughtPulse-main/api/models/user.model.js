import mongoose from "mongoose";

// Helper function to validate email format
function validateEmail(email) {
    // Simple regex for demonstration; consider using a more robust one in production
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validateEmail, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePicture: {
        type: String,
        default: "https://shorturl.at/F3W9R"
    },
    bio: {
        type: String,
        maxlength: 200,
        default: ""
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    followers: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: []
    }
}, { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export