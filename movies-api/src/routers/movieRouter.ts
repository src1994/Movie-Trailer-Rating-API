import {Router} from 'express';
import { check } from 'express-validator';
import MovieController from '../controllers/movieController.js';
import {checkRole, checkAuth} from  '../middlewares/authMiddleware.js'; 

const router: Router = Router();

router.get('/movies',checkAuth, MovieController.getAll);

router.get('/movies/search', checkAuth, MovieController.search);

router.post('/movies/', checkRole(["ADMIN"]), MovieController.create);
router.put('/movies/:id', checkRole(["ADMIN"]), MovieController.update);
router.delete('/movies/:id', checkRole(["ADMIN"]), MovieController.delete);


export default router;

