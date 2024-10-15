import { Router } from 'express';
import { check } from 'express-validator';
import userController from '../controllers/userController.js';
import { checkRole } from '../middlewares/authMiddleware.js'; 

const router: Router = Router();

/**
 * @swagger
 * /auth/users:
 *   get:
 *     description: Get all users (Admin only).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/users', checkRole(["ADMIN"]), userController.getAll);

/**
 * @swagger
 * /auth/users/{id}:
 *   get:
 *     description: Get user by ID (Admin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get('/users/:id', checkRole(["ADMIN"]), userController.getOne);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *               role:
 *                 type: string
 *                 enum:
 *                   - USER
 *                   - ADMIN
 *                 example: USER
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Invalid input data
 */
router.post('/register', [
  check('name').notEmpty().withMessage("Name is required"),
  check('email').isEmail().withMessage("Invalid email format"),
  check('password').isStrongPassword(),
  check('role').isIn(["USER", "ADMIN"]).withMessage("Invalid role")
], userController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: Login an existing user and obtain a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Login successful, returns a JWT token
 *       400:
 *         description: Invalid input data
 */
router.post('/login', [
  check('email').isEmail().withMessage("Invalid email format"),
  check('password').notEmpty().withMessage('Password is required'),
], userController.login);

/**
 * @swagger
 * /auth/users/{id}:
 *   put:
 *     description: Update user details (Admin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
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
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: janedoe@example.com
 *               role:
 *                 type: string
 *                 enum:
 *                   - USER
 *                   - ADMIN
 *                 example: USER
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/users/:id', checkRole(["ADMIN"]), userController.update);

/**
 * @swagger
 * /auth/users/{id}:
 *   delete:
 *     description: Delete a user (Admin only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete('/users/:id', checkRole(["ADMIN"]), userController.delete);

export default router;
