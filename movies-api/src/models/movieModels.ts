import mongoose from "mongoose";


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
        default: 'no-image.png'
    },
    genres: {
        type:[String],
        required: true
    }
});

export interface IMovie extends  mongoose.Document {
    title: string;
    releaseDate: Date;
    trailerLink: string;
    posterUrl: string;
    genres: string[];
}

export default mongoose.model<IMovie>("Movie", MovieSchema)
