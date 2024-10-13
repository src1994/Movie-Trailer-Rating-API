import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';

dotenv.config(); 

const SECRET_KEY = process.env.SECRET_KEY || ""; 

export function checkRole(roles: string[]) {
    return function(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided" });
        }

        try {
            const decodedToken: any = jwt.verify(token, SECRET_KEY);
            
            if (!roles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Access Forbidden. User doesn't have required role" });
            }

            next();  
        } catch (error) {
            return res.status(403).json({ message: "Access Forbidden. Invalid or expired token" });
        }
    }
}
