import mongoose from "mongoose";
const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now }
});
const RatingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 }
});
const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    trailerLink: {
        type: String,
        required: true
    },
    posterUrl: {
        type: String,
        default: 'no-image.jpg'
    },
    genres: {
        type: [String],
        required: true
    },
    comments: [CommentSchema],
    ratings: [RatingSchema]
});
export default mongoose.model("Movie", MovieSchema);
