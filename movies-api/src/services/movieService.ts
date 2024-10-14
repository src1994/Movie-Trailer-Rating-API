import { IMovie } from "../models/movieModels.js"; 
import MovieModel from "../models/movieModels.js"
import fileService from '../utils/fileService.js';

class MovieService {
   /* async getAll(): Promise<IMovie[]> {
        try {
            return await MovieModel.find();
        } catch (error) {
            throw new Error('Failed to get all movies');
        }
    }

    */

    async getAll(): Promise<IMovie[]> {
        return await MovieModel.find({}, 'title trailerLink'); 
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
        try{
            const foundMovie: IMovie | null = await MovieModel.findById(movieId);
            return foundMovie;
        } catch (error) {
            throw new Error('Failed to get movie by id');
        }
    }
    async create(movieData: IMovie, poster: any) {
        try {
            if (poster) {
                const posterUrl = fileService.save(poster);
                movieData.posterUrl = posterUrl;

            }
            const newMovie = new MovieModel (movieData);
            return await newMovie.save();

        }catch (err) {
            console.log(err);
        }
    }
    async update(movieId: string, movie: IMovie): Promise<IMovie | null> {
        try{
            const  updatedMovie = await MovieModel.findByIdAndUpdate(movieId, movie, {new: true});
            return  updatedMovie;
        } catch(error) {
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
}



export default new MovieService();

