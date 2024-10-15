import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema({
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true }
}, { timestamps: true });
export default mongoose.model('Review', reviewSchema);
