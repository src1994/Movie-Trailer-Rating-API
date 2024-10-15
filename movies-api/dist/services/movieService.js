import MovieModel from "../models/movieModels.js";
import path from 'path';
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
                const fileName = `${movieData.title.replace(/ /g, '-')}-poster.jpg`;
                const __dirname = path.dirname(new URL(import.meta.url).pathname);
                const filePath = path.join(__dirname, '..', 'static', fileName);
                await new Promise((resolve, reject) => {
                    poster.mv(filePath, (err) => {
                        if (err) {
                            console.log(err);
                            return reject(new Error('Failed to upload poster'));
                        }
                        resolve();
                    });
                });
                movieData.posterUrl = `/static/${fileName}`;
            }
            const newMovie = new MovieModel(movieData);
            return await newMovie.save();
        }
        catch (err) {
            console.log(err);
            throw new Error('Failed to create movie');
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
    async addComment(movieId, userId, content) {
        try {
            const movie = await MovieModel.findById(movieId);
            if (!movie) {
                throw new Error('Movie not found');
            }
            const comment = {
                user: userId,
                content,
                date: new Date()
            };
            movie.comments.push(comment);
            return await movie.save();
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to add comment');
        }
    }
    async rateMovie(movieId, userId, rating) {
        try {
            if (rating < 1 || rating > 5) {
                throw new Error('Rating must be between 1 and 5');
            }
            const movie = await MovieModel.findById(movieId);
            if (!movie) {
                throw new Error('Movie not found');
            }
            const existingRating = movie.ratings.find(rating => rating.user.toString() === userId);
            if (existingRating) {
                existingRating.rating = rating;
            }
            else {
                movie.ratings.push({ user: userId, rating });
            }
            return await movie.save();
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to rate movie');
        }
    }
}
export default new MovieService();
