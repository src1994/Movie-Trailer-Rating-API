/*
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { trusted } from 'mongoose';
import { relative } from 'path';

dotenv.config(); 

const SECRET_KEY = process.env.SECRET_KEY || ""; 


export function checkRole(role: string) {
    return  async (req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) { 
            return res.status(401).json({ message: "Unauthorized" });
        }
        try {
            const  decoded = jwt.verify(token, process.env.SECRET_KEY as string);
            if (!role.includes(decoded.role))
       
}
*/