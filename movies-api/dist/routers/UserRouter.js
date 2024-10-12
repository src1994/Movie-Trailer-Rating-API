import { Router } from 'express';
import { check } from 'express-validator';
import userController from '../controllers/userController.js';
const router = Router();
router.get('/users', userController.getAll);
router.get('/users/:id', userController.getOne);
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
router.put('/users/:id', userController.update);
router.delete('/users/:id', userController.delete);
export default router;
