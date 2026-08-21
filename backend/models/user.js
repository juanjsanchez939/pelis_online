import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    uuid: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    hashedPassword: { type: String, required: true },
    fullName: { type: String, trim: true, maxlength: 100 },
    roles: { type: [String], default: ['user'], enum: ['user', 'admin'] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
}, { timestamps: true });

export default mongoose.model('users', userSchema);
