
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true, trim: true },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    rating: { type: Number, min: 0, max: 10 },
    date: { type: String, required: true },
}, { _id: false });

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: 200, index: true },
    titleEn: { type: String, trim: true, maxlength: 200 },
    category: { type: [String], default: [], index: true },
    thumbnail: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 5000 },
    year: { type: Number, min: 1888, max: 2100, index: true },
    director: { type: String, trim: true, maxlength: 100 },
    duration: { type: String, trim: true, maxlength: 20 },
    rating: { type: Number, min: 0, max: 10, default: 0, index: true },
    cast: { type: [String], default: [] },
    trailer: { type: String, trim: true },
    tmdbId: { type: Number, unique: true, sparse: true, index: true },
    type: { type: String, enum: ['movie', 'tv'], default: 'movie', index: true },
    comments: { type: [commentSchema], default: [] },
}, { timestamps: true });

movieSchema.index({ title: 'text', description: 'text', category: 'text' });
movieSchema.index({ category: 1, year: -1 });
movieSchema.index({ type: 1, rating: -1 });

export default mongoose.model('movies', movieSchema);
