import jwt from 'jsonwebtoken';
import configuration from './config';

const SECRET_KEY = configuration.JWT_SECRET;

// Function to generate a JWT token
export const generateToken = (
    payload: object,
    expiresIn: string = '1h',
    userId: string
): string => {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: expiresIn,
        issuer: "https://auth.messant.in",
        subject: userId,
        audience: ["auth", "api", "chat", "call"],
    });
};

// Function to verify a JWT token
export const verifyToken = (token: string): string | object => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        throw new Error('Invalid token');
    }
};
