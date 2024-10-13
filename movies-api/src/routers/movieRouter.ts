import {Router} from 'express';
import { check } from 'express-validator';
import MovieController from '../controllers/movieController.js';
import {checkRole} from  '../middlewares/authMiddleware.js'; 

const router: Router = Router();

router.get('/movies', MovieController.getAll);
router.get('/movies/:id', MovieController.getOne);
router.post('/movies/', checkRole(["ADMIN"]), MovieController.create);
router.put('/movies/:id', checkRole(["ADMIN"]), MovieController.update);
router.delete('/movies/:id', checkRole(["ADMIN"]), MovieController.delete);


export default router;

