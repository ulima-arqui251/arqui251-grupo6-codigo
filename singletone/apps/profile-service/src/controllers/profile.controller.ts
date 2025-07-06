import { Request, Response } from 'express';
import axios from 'axios';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const userResponse = await axios.get(`${process.env.USER_SERVICE_URL}/users/${userId}`);
        const user = userResponse.data;

        res.json({
        profileId: user.profile_id,
        name: user.name,
        lastName: user.last_name,
        picture: user.picture,
        subscriptionType: user.subscription?.type || 'free'
        });
    } catch (error) {
        console.error('❌ Error al obtener perfil:', error);
        res.status(500).json({ message: 'Error interno' });
    }
};