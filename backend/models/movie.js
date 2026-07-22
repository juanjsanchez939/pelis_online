
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: String,
    category: [String],
    thumbnail: String,
    description: String,
    year: Number,
    director: String,
    duration: String,
    rating: Number,
    cast: [String],
    trailer: String,
    comments: [
        {
            user: String,
            text: String,
            rating: Number,
            date: String,
        }
    ],
});

export default mongoose.model('movies', movieSchema);
