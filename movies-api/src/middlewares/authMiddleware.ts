import { check } from 'express-validator';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { trusted } from 'mongoose';
import { relative } from 'path';

dotenv.config(); 

const SECRET_KEY = process.env.SECRET_KEY || ""; 

export function checkRole(roles: string[]) {
    return function(req: Request, res: Response, next: NextFunction) {
        const  token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided" })
        }
        try {
            const  decodedToken: any = jwt.verify(token,  SECRET_KEY);
            if(!roles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Acess Forbidden. User dosen't have required rule"} 
                
                )}
            }catch (error) {
                return res.status(403).json({error: "Access Forbidden. Invalid or  expired token"})
            }
            next();
        }
    
}