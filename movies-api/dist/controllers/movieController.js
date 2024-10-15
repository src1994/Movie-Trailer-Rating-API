import movieService from '../services/movieService.js';
class MovieController {
    async getAll(req, res, next) {
        try {
            const movies = await movieService.getAll();
            res.json(movies);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch movies' });
        }
    }
    async search(req, res, next) {
        try {
            const page = req.query.page ? parseInt(req.query.page) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            const sortBy = req.query.sortBy ? req.query.sortBy : 'releaseDate';
            const year = req.query.year ? req.query.year : undefined;
            const name = req.query.name ? req.query.name : undefined;
            const genre = req.query.genre ? req.query.genre : undefined;
            const releaseDate = req.query.releaseDate ? req.query.releaseDate : undefined;
            if (isNaN(page) || page <= 0) {
                return res.status(400).json({ error: 'Invalid page number' });
            }
            if (isNaN(limit) || limit <= 0) {
                return res.status(400).json({ error: 'Invalid limit value' });
            }
            const validSortFields = ['releaseDate', 'title', 'genres'];
            const sortField = validSortFields.includes(sortBy) ? sortBy : 'releaseDate';
            const filters = {};
            if (year) {
                const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
                const yearEnd = new Date(`${year}-12-31T23:59:59.999Z`);
                filters.releaseDate = { $gte: yearStart, $lte: yearEnd };
            }
            if (req.query.releaseDate) {
                const releaseDate = new Date(req.query.releaseDate);
                filters.releaseDate = releaseDate;
            }
            if (name)
                filters.title = { $regex: name, $options: 'i' };
            if (genre)
                filters.genres = { $regex: genre, $options: 'i' };
            const movies = await movieService.search(filters, page, limit, sortField);
            res.json(movies);
        }
        catch (error) {
            console.error('Error during movie search:', error);
            res.status(500).json({ error: 'Failed to search movies' });
        }
    }
    async create(req, res, next) {
        var _a;
        try {
            const { title, releaseDate, trailerLink, genres } = req.body;
            const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster;
            if (!title || !releaseDate || !trailerLink || !genres) {
                return res.status(400).json({ error: 'All fields (title, releaseDate, trailerLink, genres) are required' });
            }
            const movieData = {
                title,
                releaseDate,
                trailerLink,
                genres
            };
            const createdMovie = await movieService.create(movieData, poster);
            res.status(201).json(createdMovie);
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Failed to create movie' });
        }
    }
    async update(req, res, next) {
        try {
            const movieId = req.params.id;
            const movieToUpdate = req.body;
            const updatedMovie = await movieService.update(movieId, movieToUpdate);
            if (!updatedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.json(updatedMovie);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update movie' });
        }
    }
    async delete(req, res, next) {
        try {
            const movieId = req.params.id;
            const deletedMovie = await movieService.delete(movieId);
            if (!deletedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.json(deletedMovie);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete movie' });
        }
    }
    async addComment(req, res, next) {
        try {
            const movieId = req.params.id;
            const { content } = req.body;
            const userId = req.user.id;
            if (!content) {
                return res.status(400).json({ error: 'Comment content is required' });
            }
            const updatedMovie = await movieService.addComment(movieId, userId, content);
            res.status(200).json({
                message: 'Comment added successfully',
                movie: updatedMovie
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }
    async rateMovie(req, res, next) {
        try {
            const movieId = req.params.id;
            const { rating } = req.body;
            const userId = req.user.id;
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be between 1 and 5' });
            }
            const updatedMovie = await movieService.rateMovie(movieId, userId, rating);
            res.status(200).json({
                message: 'Rating added/updated successfully',
                movie: updatedMovie
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to rate movie' });
        }
    }
}
export default new MovieController();
