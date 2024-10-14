import userService from '../services/userService.js';
import { validationResult } from 'express-validator';
class UserController {
    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.json(users);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get users' });
        }
    }
    async getOne(req, res, next) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get user' });
        }
    }
    async register(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const userToCreate = req.body;
            const createdUser = await userService.register(userToCreate);
            res.status(201).json(createdUser);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Failed to create user' });
        }
    }
    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { email, password } = req.body;
            const foundUserWithToken = await userService.login(email, password);
            if (foundUserWithToken === null) {
                return res.status(404).json({ error: 'failed to login. Invalid Credentials' });
            }
            res.json(foundUserWithToken);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to login user' });
        }
    }
    async update(req, res, next) {
        try {
            const userId = req.params.id;
            const userToUpdate = req.body;
            const updatedUser = userService.update(userId, userToUpdate);
            if (!updatedUser) {
                res.status(404).json({ error: 'User not found' });
            }
            res.json(updatedUser);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update user' });
        }
    }
    async delete(req, res, next) {
        try {
            const userId = req.params.id;
            const deletedUser = userService.delete(userId);
            if (!deletedUser) {
                res.status(404).json({ error: 'User not found' });
            }
            res.json(deletedUser);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete user' });
        }
    }
}
export default new UserController();
