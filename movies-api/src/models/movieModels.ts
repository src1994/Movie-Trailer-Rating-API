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

export interface IMovie extends mongoose.Document {
    title: string;
    releaseDate: Date;
    trailerLink: string;
    posterUrl: string;
    genres: string[];
    comments: Array<{ user: string, content: string, date: Date }>;
    ratings: Array<{ user: string, rating: number }>;
}

export default mongoose.model<IMovie>("Movie", MovieSchema);
