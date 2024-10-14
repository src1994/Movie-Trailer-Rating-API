import bcrypt from 'bcrypt';
import userModels from "../models/userModels.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
class UserService {
    async getAll() {
        try {
            return await userModels.find();
        }
        catch (error) {
            throw new Error('Failed to get all users');
        }
    }
    async getUserById(userId) {
        try {
            const foundUser = await userModels.findById(userId);
            return foundUser;
        }
        catch (error) {
            throw new Error('Failed to get user by id');
        }
    }
    async register(newUser) {
        try {
            const foundUser = await userModels.findOne({ email: newUser.email });
            if (foundUser) {
                throw new Error('Email already exists');
            }
            const hashedPassword = await bcrypt.hash(newUser.password, 10);
            newUser.password = hashedPassword;
            const createdUser = await userModels.create(newUser);
            console.log(createdUser);
            return createdUser;
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to create user');
        }
    }
    async login(email, password) {
        try {
            const foundUser = await userModels.findOne({ email: email });
            if (!foundUser) {
                return null;
            }
            const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
            if (!isPasswordMatch) {
                return null;
            }
            let token = '';
            if (process.env.SECRET_KEY) {
                token = jwt.sign({
                    id: foundUser._id,
                    email: foundUser.email,
                    role: foundUser.role,
                }, process.env.SECRET_KEY, { expiresIn: '1h' });
            }
            else {
                throw new Error('SECRET_KEY is not defined');
            }
            return { user: foundUser, accessToken: token };
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to login user');
        }
    }
    async update(userId, user) {
        try {
            const updatedUser = await userModels.findByIdAndUpdate(userId, user, { new: true });
            return updatedUser;
        }
        catch (error) {
            throw new Error('Failed to update user');
        }
    }
    async delete(userId) {
        try {
            const deletedUser = await userModels.findByIdAndDelete(userId);
            return deletedUser;
        }
        catch (error) {
            throw new Error('Failed to delete user');
        }
    }
}
export default new UserService();
