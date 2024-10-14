import {Request, Response, NextFunction} from 'express';
import { IMovie } from '../models/movieModels.js';
import movieService from '../services/movieService.js';

class MovieController {
   /* async getAll(req: Request, res: Response, next: NextFunction) {
        try{
            
            const movies: IMovie[] = await movieService.getAll();
            

            res.json(movies);
        } catch (error) {
            res.status(500).json({error: 'Failed to get movies'})
        }
    }
*/

async getAll(req: Request, res: Response, next: NextFunction) {
    try {
        const movies = await movieService.getAll(); 
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
}

async search(req: Request, res: Response, next: NextFunction) {
    try {
      
        const page = req.query.page ? (req.query.page as string) : '1';
        const limit = req.query.limit ? (req.query.limit as string) : '10';
        const sortBy = req.query.sortBy ? (req.query.sortBy as string) : 'releaseDate';
        const year = req.query.year ? (req.query.year as string) : undefined;
        const name = req.query.name ? (req.query.name as string) : undefined;
        const genre = req.query.genre ? (req.query.genre as string) : undefined;

        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        
        if (isNaN(pageNumber) || pageNumber <= 0) {
            return res.status(400).json({ error: 'Invalid page number' });
        }
        if (isNaN(limitNumber) || limitNumber <= 0) {
            return res.status(400).json({ error: 'Invalid limit value' });
        }

        const validSortFields = ['releaseDate', 'title', 'genre'];

       
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'releaseDate';

        // Create filters based on query params
        const filters: any = {};
        if (year) filters.releaseDate = { $regex: year, $options: 'i' };  // Filter by release year
        if (name) filters.title = { $regex: name, $options: 'i' };  // Filter by name
        if (genre) filters.genres = { $regex: genre, $options: 'i' };  // Filter by genre

        // Fetch movies from the service layer with pagination, filters, and sorting
        const movies = await movieService.search(filters, pageNumber, limitNumber, sortField);

        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search movies' });
    }
}

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const {title, releaseDate, trailerLink, genres} = req.body;
            const poster = req.files?.poster;

            const movieData= {
                title,
                releaseDate, 
                trailerLink,
                genres
            }as IMovie;
            

            const createdMovie = await movieService.create(movieData, poster);

            res.status(201).json(createdMovie);

        }catch (err) {
            console.log(err);
        }
    }
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const movieId: string = req.params.id;
            const movieToUpdate: IMovie = req.body;

            const updatedMovie = await movieService.update(movieId, movieToUpdate);

            if (!updatedMovie) {
                res.status(404).json({error: 'Movie not found'});
            }
            res.json(updatedMovie);
        } catch (error) {
            res.status(500).json({error: 'Failed to upadate movie'})
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const  movieId: string = req.params.id;
            const  deletedMovie = await movieService.delete(movieId);

            if (!deletedMovie) {
                res.status(404).json({error: 'Movie not found'});
            }
            res.json(deletedMovie);
        } catch (error) {
            res.status(500).json({error: 'Failed to delete movie'})
        }
    }
}

export default new MovieController();

