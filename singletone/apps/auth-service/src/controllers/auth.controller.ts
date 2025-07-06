import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateToken, validateToken } from '../utils/jwt';

const MOCK_USER = {
    email: 'test@singletone.com',
    passwordHash: bcrypt.hashSync('123456', 10),
    userId: 101,
};

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (email !== MOCK_USER.email || !bcrypt.compareSync(password, MOCK_USER.passwordHash)) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generateToken({ userId: MOCK_USER.userId });
    res.json({ token });
}

export async function verifyToken(req: Request, res: Response) {
    const { token } = req.body;

    try {
        const decoded = validateToken(token);
        res.json({ valid: true, data: decoded });
    } catch (err) {
        res.status(401).json({ valid: false, error: 'Token inválido o expirado' });
    }
}