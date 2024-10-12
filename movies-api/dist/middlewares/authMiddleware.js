import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "";
export function checkRole(roles) {
    return function (req, res, next) {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized. No token provided" });
        }
        try {
            const decodedToken = jwt.verify(token, SECRET_KEY);
            if (!roles.includes(decodedToken.role)) {
                return res.status(403).json({ message: "Acess Forbidden. User dosen't have required rule" });
            }
            next();
        }
        catch (error) {
            return res.status(403).json({ error: "Access Forbidden. Invalid or  expired token" });
        }
    };
}
