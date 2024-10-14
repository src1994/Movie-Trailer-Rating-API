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
            const page = req.query.page ? req.query.page : '1';
            const limit = req.query.limit ? req.query.limit : '10';
            const sortBy = req.query.sortBy ? req.query.sortBy : 'releaseDate';
            const year = req.query.year ? req.query.year : undefined;
            const name = req.query.name ? req.query.name : undefined;
            const genre = req.query.genre ? req.query.genre : undefined;
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
            const filters = {};
            if (year)
                filters.releaseDate = { $regex: year, $options: 'i' };
            if (name)
                filters.title = { $regex: name, $options: 'i' };
            if (genre)
                filters.genres = { $regex: genre, $options: 'i' };
            const movies = await movieService.search(filters, pageNumber, limitNumber, sortField);
            res.json(movies);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to search movies' });
        }
    }
    async create(req, res, next) {
        var _a;
        try {
            const { title, releaseDate, trailerLink, genres } = req.body;
            const poster = (_a = req.files) === null || _a === void 0 ? void 0 : _a.poster;
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
        }
    }
    async update(req, res, next) {
        try {
            const movieId = req.params.id;
            const movieToUpdate = req.body;
            const updatedMovie = await movieService.update(movieId, movieToUpdate);
            if (!updatedMovie) {
                res.status(404).json({ error: 'Movie not found' });
            }
            res.json(updatedMovie);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to upadate movie' });
        }
    }
    async delete(req, res, next) {
        try {
            const movieId = req.params.id;
            const deletedMovie = await movieService.delete(movieId);
            if (!deletedMovie) {
                res.status(404).json({ error: 'Movie not found' });
            }
            res.json(deletedMovie);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete movie' });
        }
    }
}
export default new MovieController();
