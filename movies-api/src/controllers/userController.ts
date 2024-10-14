import {Request, Response, NextFunction} from 'express';
import { IUser } from '../models/userModels.js';
import userService from '../services/userService.js';
import { validationResult } from 'express-validator'; 

class UserController {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users: IUser[] | undefined = await userService.getAll();
            res.json(users);
        } catch(error){
            res.status(500).json({error: 'Failed to get users'})
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
       try {
        const userId: string =req.params.id;

        const user: IUser | null = await userService.getUserById(userId);

        if(!user) {
            res.status(404).json({error: 'User not found'})
        }

        res.json(user);

       }catch (error){
        res.status(500).json({error: 'Failed to get user'});
       }
    }

    async register(req: Request, res: Response, next: NextFunction) {
       try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({errors: errors.array()})
        }

        const userToCreate: IUser = req.body;
        const createdUser: any = await userService.register(userToCreate);
        res.status(201).json(createdUser);
       } catch (error){
        console.log(error)
        res.status(500).json({message: 'Failed to create user'})
       }
    }

    async login (req: Request, res: Response, next: NextFunction) {
        try { 
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            const {email, password} = req.body;

            const foundUserWithToken: any  = await userService.login(email, password);
            if (foundUserWithToken === null) {
                return res.status(404).json({error: 'failed to login. Invalid Credentials'});
            }
            res.json(foundUserWithToken);
        }catch (error) {
            res.status(500).json({error: 'Failed to login user'})
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = req.params.id;
            const userToUpdate: IUser = req.body;
            const updatedUser = userService.update(userId, userToUpdate);

            if(!updatedUser) {
                res.status(404).json({error: 'User not found'})
            }

            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({error: 'Failed to update user'})
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = req.params.id;
            const deletedUser = userService.delete(userId);

            if (!deletedUser) {
                res.status(404).json({error: 'User not found'});
            }

            res.json(deletedUser);
        }catch (error) {
            res.status(500).json({error: 'Failed to delete user'})
        }
    }
}

export default new UserController();
