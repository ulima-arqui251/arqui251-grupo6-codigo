import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { generateToken, validateToken } from '../utils/jwt';
import { redisClient } from '../utils/redis';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL;
if (!USER_SERVICE_URL) {
    throw new Error('USER_SERVICE_URL no está definido en el .env del auth-service');
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        console.log('🔐 Haciendo login con:', email);
        const { data: user } = await axios.post(`${USER_SERVICE_URL}/users/credentials`, { email });
        console.log('📥 Respuesta del user-service:', user);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = generateToken({ userId: user.user_id });

        await redisClient.set(user.user_id.toString(), user.sub_type);

        return res.json({ token, user_id: user.user_id });
    } catch (err: any) {
        console.error('Login error:', err.response?.data || err.message || err);
        return res.status(500).json({ error: 'Error en el login', details: err.response?.data || err.message });
    }
}

export async function verifyToken(req: Request, res: Response) {
    const { token } = req.body;

    try {
        const decoded = validateToken(token);
        res.json({ valid: true, data: decoded });
    } catch (err) {
        return res.status(401).json({ valid: false, error: 'Token inválido o expirado' });
    }
}