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
        type: [String],
        required: true
    }
});
export default mongoose.model("Movie", MovieSchema);
