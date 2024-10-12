import movieService from '../services/movieService.js';
class MovieController {
    async getAll(req, res, next) {
        try {
            const movies = await movieService.getAll();
            res.json(movies);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get movies' });
        }
    }
    async getOne(req, res, next) {
        try {
            const movieId = req.params.id;
            const movie = await movieService.getOne(movieId);
            if (!movie) {
                return res.status(400).json({ error: 'Movie not found' });
            }
            res.json(movie);
        }
        catch (error) {
            res.status(500).json({ erro: 'Failed to get movie' });
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
