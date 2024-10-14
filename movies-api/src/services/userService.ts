import { IUser } from '../models/userModels.js';
import bcrypt from 'bcrypt'
import userModels from "../models/userModels.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { constrainedMemory } from 'process';

dotenv.config(); 

class UserService {

    async getAll(): Promise<IUser[]> {
        try{
            return await userModels.find();
        }catch (error) {
            throw new Error('Failed to get all users');
        }
    } 

    async  getUserById(userId: string):Promise<IUser | null> { 
        try {
            const foundUser: IUser | null = await userModels.findById(userId);

            return foundUser;
        } catch (error) {
            throw new Error('Failed to get user by id');
        }
    }
    
    async register (newUser: IUser): Promise<IUser> {
        try {
            const foundUser = await userModels.findOne ({email: newUser.email});

            if (foundUser) {
                throw new  Error('Email already exists');
            }

            const hashedPassword = await bcrypt.hash(newUser.password,10);

            newUser.password = hashedPassword;

            const createdUser = await userModels.create(newUser);
            console.log(createdUser)
            return createdUser;
        } catch (error) {
            console.log(error);
            throw new Error ('Failed to create user');
        } 
    } 

    async login(email: string, password: string): Promise<{ user: IUser, accessToken: string } | null> {
        try {
            // Find the user by email
            const foundUser = await userModels.findOne({ email: email });
    
            if (!foundUser) {
                return null; // User not found
            }
    
            // Compare the provided password with the hashed password stored in the database
            const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
            if (!isPasswordMatch) {
                return null; // Incorrect password
            }
    
            // Generate a JWT token if password matches
            let token = '';
            if (process.env.SECRET_KEY) {
                token = jwt.sign(
                    {
                        id: foundUser._id,
                        email: foundUser.email,
                        role: foundUser.role,
                    },
                    process.env.SECRET_KEY,  // Secret key from environment variables
                    { expiresIn: '1h' }  // Token expiration set to 1 hour
                );
            } else {
                throw new Error('SECRET_KEY is not defined');
            }
    
            // Return the user object and the generated JWT token
            return { user: foundUser, accessToken: token };
        } catch (error) {
            console.error(error);
            throw new Error('Failed to login user');
        }
    }

    async update(userId: string, user: IUser): Promise<IUser | null> {
        try {
           const updatedUser = await userModels.findByIdAndUpdate(userId, user, {new: true});

           return updatedUser;
        } catch (error) {
            throw new Error('Failed to update user');
        }
    } 

    async delete(userId: string):Promise<IUser | null> {
      try {
        const deletedUser = await userModels.findByIdAndDelete(userId);
        return deletedUser;
      }catch (error) {
        throw new Error('Failed to delete user');
      }
    } 

}

export default new UserService();