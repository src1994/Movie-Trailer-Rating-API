import { Router } from 'express';
import { check } from 'express-validator';
import userController from '../controllers/userController.js';
import { checkRole } from '../middlewares/authMiddleware.js';
const router = Router();
router.get('/users', checkRole(["ADMIN"]), userController.getAll);
router.get('/users/:id', checkRole(["ADMIN"]), userController.getOne);
router.post('/register', [
    check('name').notEmpty().withMessage("Name is required"),
    check('email').isEmail().withMessage("Invalid email format"),
    check('password').isStrongPassword(),
    check('role').isIn(["USER", "ADMIN"]).withMessage("Invalid role")
], userController.register);
router.post('/login', [
    check('email').isEmail().withMessage("invalid email format"),
    check('password').notEmpty().withMessage('Password is required'),
], userController.login);
router.put('/users/:id', checkRole(["ADMIN"]), userController.update);
router.delete('/users/:id', checkRole(["ADMIN"]), userController.delete);
export default router;
