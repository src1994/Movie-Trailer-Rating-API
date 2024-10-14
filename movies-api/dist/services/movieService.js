import MovieModel from "../models/movieModels.js";
import fileService from '../utils/fileService.js';
class MovieService {
    async getAll() {
        return await MovieModel.find({}, 'title trailerLink');
    }
    async search(filters, page, limit, sortBy) {
        const skip = (page - 1) * limit;
        const movies = await MovieModel.find(filters)
            .sort({ [sortBy]: 1 })
            .skip(skip)
            .limit(limit);
        const total = await MovieModel.countDocuments(filters);
        return {
            movies,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    }
    async getOne(movieId) {
        try {
            const foundMovie = await MovieModel.findById(movieId);
            return foundMovie;
        }
        catch (error) {
            throw new Error('Failed to get movie by id');
        }
    }
    async create(movieData, poster) {
        try {
            if (poster) {
                const posterUrl = fileService.save(poster);
                movieData.posterUrl = posterUrl;
            }
            const newMovie = new MovieModel(movieData);
            return await newMovie.save();
        }
        catch (err) {
            console.log(err);
        }
    }
    async update(movieId, movie) {
        try {
            const updatedMovie = await MovieModel.findByIdAndUpdate(movieId, movie, { new: true });
            return updatedMovie;
        }
        catch (error) {
            throw new Error('Failed to update movie');
        }
    }
    async delete(movieId) {
        try {
            const deletedMovie = await MovieModel.findByIdAndDelete(movieId);
            return deletedMovie;
        }
        catch (error) {
            throw new Error('Failed to delete movie');
        }
    }
}
export default new MovieService();
