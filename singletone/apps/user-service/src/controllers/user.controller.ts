import { Request, Response } from 'express';
import { pg } from '../db/postgres';

export async function getUsers(req: Request, res: Response) {
    try {
        const result = await pg.query('SELECT * FROM UserProfile');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error querying UserProfile', details: err });
    }
}

export async function getAllDataUsers(req: Request, res: Response) {
    try {
        const result = await pg.query(`
        SELECT 
            up.profile_id,
            up.user_id,
            up.creation_date,
            bd.name,
            bd.last_name,
            bd.nickname,
            bd.mail,
            bd.picture,
            s.type AS sub_type,
            s.expiration_date
        FROM UserProfile up
        LEFT JOIN BasicData bd ON bd.profile_id = up.profile_id
        LEFT JOIN Suscription s ON s.profile_id = up.profile_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error querying full user data', details: err });
    }
}