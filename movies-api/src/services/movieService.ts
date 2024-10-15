import { IMovie } from "../models/movieModels.js";
import MovieModel from "../models/movieModels.js";
import fileService from "../utils/fileService.js";


class MovieService {

    async getAll(): Promise<IMovie[]> {
        return await MovieModel.find({}, 'title releaseDate genres posterUrl trailerLink');
    }

    async search(filters: any, page: number, limit: number, sortBy: string): Promise<any> {
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

    async getOne(movieId: string): Promise<IMovie | null> {
        try {
            const foundMovie: IMovie | null = await MovieModel.findById(movieId);
            return foundMovie;
        } catch (error) {
            throw new Error('Failed to get movie by id');
        }
    }

   
    async create(movieData: IMovie, poster: any) {
        try {
            if (poster) {
                
                const allowedTypes = ['image/jpeg', 'image/png'];
                if (!allowedTypes.includes(poster.mimetype)) {
                    throw new Error('Invalid file type. Only JPEG and PNG are allowed.');
                }

                
                const fileName = fileService.save(poster);
                movieData.posterUrl = `/static/${fileName}`;
            }

            
            const newMovie = new MovieModel(movieData);
            return await newMovie.save();
        } catch (err) {
            console.log(err);
            throw new Error('Failed to create movie');
        }
    }
    
    

    async update(movieId: string, movie: IMovie): Promise<IMovie | null> {
        try {
            const updatedMovie = await MovieModel.findByIdAndUpdate(movieId, movie, { new: true });
            return updatedMovie;
        } catch (error) {
            throw new Error('Failed to update movie');
        }
    }

    async delete(movieId: string): Promise<IMovie | null> {
        try {
            const deletedMovie = await MovieModel.findByIdAndDelete(movieId);
            return deletedMovie;
        } catch (error) {
            throw new Error('Failed to delete movie');
        }
    }

    async addComment(movieId: string, userId: string, content: string): Promise<IMovie | null> {
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
        } catch (error) {
            console.log(error);
            throw new Error('Failed to add comment');
        }
    }

    
    async rateMovie(movieId: string, userId: string, rating: number): Promise<IMovie | null> {
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
            } else {
                movie.ratings.push({ user: userId, rating });
            }

            return await movie.save();
        } catch (error) {
            console.log(error);
            throw new Error('Failed to rate movie');
        }
    }
}

export default new MovieService();
