import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES_IN_ENV = process.env.JWT_EXPIRES_IN || '1h';

export function generateToken(payload: object): string {
    const signOptions: SignOptions = {};

    if (!isNaN(Number(EXPIRES_IN_ENV))) {
        // Si es número como "3600"
        signOptions.expiresIn = Number(EXPIRES_IN_ENV);
    } else {
        // Si es string como "1h", "7d", etc.
        signOptions.expiresIn = EXPIRES_IN_ENV as `${number}${'s' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
    }

    return jwt.sign(payload, SECRET, signOptions);
}

export function validateToken(token: string) {
    return jwt.verify(token, SECRET);
}