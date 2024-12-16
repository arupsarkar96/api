import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../config/token";

export const authTokenChecker = (req: Request, res: Response, next: NextFunction): void => {
    const authorization = req.headers['authorization'];
    const token = authorization?.split(" ")[1]

    if (!token) {
        res.status(401).json({ message: 'Access Denied: No token provided' });
        return
    }

    try {
        const data: any = verifyToken(token);
        const aud = data.aud

        if (aud.includes("auth")) {
            req.headers["x-uid"] = data.sub;
            req.headers["x-username"] = data.username;
            next();
        } else {
            res.status(401).json({ message: 'Access Denied: Invalid authorization' });
            return
        }
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Access Denied: Invalid token' });
        return
    }
};