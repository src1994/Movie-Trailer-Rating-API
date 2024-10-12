import MovieModel from "../models/movieModels.js";
import fileService from '../utils/fileService.js';
class MovieService {
    async getAll() {
        try {
            return await MovieModel.find();
        }
        catch (error) {
            throw new Error('Failed to get all movies');
        }
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
