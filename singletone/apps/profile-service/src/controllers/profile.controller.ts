import { Request, Response } from 'express';
import axios from 'axios';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const token = req.headers.authorization;

        const userResponse = await axios.get(
            `${process.env.USER_SERVICE_URL}/users/by-id/${userId}`,
            {
                headers: {
                    Authorization: token || '',
                },
            }
        );

        const user = userResponse.data;

        res.json({
            profileId: user.profile_id,
            name: user.name,
            lastName: user.last_name,
            picture: user.picture,
            subscriptionType: user.sub_type || 'free',
        });
    } catch (error: any) {
        console.error('❌ Error al obtener perfil:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Error interno al obtener perfil' });
    }
};