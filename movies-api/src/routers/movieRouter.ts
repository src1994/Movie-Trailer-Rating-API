import { Router } from 'express';
import { check } from 'express-validator';
import MovieController from '../controllers/movieController.js';
import { checkRole, checkAuth } from '../middlewares/authMiddleware.js'; 

const router: Router = Router();

/**
 * @swagger
 * /api/movies:
 *   get:
 *     description: Get all movies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized
 */
router.get('/movies', checkAuth, MovieController.getAll);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     description: Search movies with optional filters (e.g., year, genre, name).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: year
 *         in: query
 *         description: Filter movies by release year
 *         required: false
 *         schema:
 *           type: string
 *       - name: genre
 *         in: query
 *         description: Filter movies by genre
 *         required: false
 *         schema:
 *           type: string
 *       - name: name
 *         in: query
 *         description: Filter movies by name
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of filtered movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       401:
 *         description: Unauthorized
 */
router.get('/movies/search', checkAuth, MovieController.search);

/**
 * @swagger
 * /api/movies/{id}/comment:
 *   post:
 *     description: Add a comment to a movie.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the movie to comment on
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Great movie!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post('/movies/:id/comment', checkAuth, MovieController.addComment);

/**
 * @swagger
 * /api/movies/{id}/rate:
 *   post:
 *     description: Rate a movie.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the movie to rate
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 description: Rating of the movie (1-5)
 *                 example: 5
 *     responses:
 *       201:
 *         description: Movie rated successfully
 *       400:
 *         description: Invalid rating
 *       401:
 *         description: Unauthorized
 */
router.post('/movies/:id/rate', checkAuth, MovieController.rateMovie);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     description: Create a new movie (Admin only).
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: Movie created successfully
 *       400:
 *         description: Invalid movie data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access (Admin only)
 */
router.post('/movies', checkRole(["ADMIN"]), MovieController.create);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     description: Update a movie (Admin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the movie to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movie'
 *     responses:
 *       200:
 *         description: Movie updated successfully
 *       400:
 *         description: Invalid movie data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access (Admin only)
 */
router.put('/movies/:id', checkRole(["ADMIN"]), MovieController.update);

/**
 * @swagger
 * /api/movies/{id}:
 *   delete:
 *     description: Delete a movie (Admin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the movie to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Movie deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden access (Admin only)
 */
router.delete('/movies/:id', checkRole(["ADMIN"]), MovieController.delete);

export default router;
