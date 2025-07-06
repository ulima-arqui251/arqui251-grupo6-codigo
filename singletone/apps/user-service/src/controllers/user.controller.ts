import { Request, Response } from 'express';
import { pg } from '../db/postgres';

export async function getUsers(req: Request, res: Response) {
    try {
        const result = await pg.query('SELECT * FROM UserProfile ORDER BY user_id');
        res.json({
            instance: process.env.INSTANCE_NAME || 'default',
            users: result.rows
        });
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
                bd.password,
                s.type AS sub_type,
                s.expiration_date
            FROM UserProfile up
            LEFT JOIN BasicData bd ON bd.profile_id = up.profile_id
            LEFT JOIN Suscription s ON s.profile_id = up.profile_id
            ORDER BY up.user_id
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Error querying full user data', details: err });
    }
}

export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
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
                bd.password,
                s.type AS sub_type,
                s.expiration_date
            FROM UserProfile up
            LEFT JOIN BasicData bd ON bd.profile_id = up.profile_id
            LEFT JOIN Suscription s ON s.profile_id = up.profile_id
            WHERE up.user_id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error consultando usuario', details: err });
    }
}

export async function registerUser(req: Request, res: Response) {
    const { name, lastName, nickname, email, password } = req.body;

    if (!name || !lastName || !nickname || !email || !password) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        // Obtener el último user_id
        const userRes = await pg.query(`SELECT MAX(user_id) AS max_user FROM UserProfile`);
        const lastUserId = userRes.rows[0].max_user || 100;
        const newUserId = lastUserId + 1;

        // Obtener el último profile_id
        const profileRes = await pg.query(`SELECT MAX(profile_id) AS max_profile FROM UserProfile`);
        const lastProfileId = profileRes.rows[0].max_profile || 1000;
        const newProfileId = lastProfileId + 1;

        // Insertar en UserProfile
        await pg.query(`
            INSERT INTO UserProfile (profile_id, user_id, creation_date) 
            VALUES ($1, $2, CURRENT_DATE)
        `, [newProfileId, newUserId]);

        // Insertar en BasicData
        await pg.query(`
            INSERT INTO BasicData (data_id, profile_id, name, last_name, nickname, mail, picture, password) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            newProfileId,
            newProfileId,
            name,
            lastName,
            nickname,
            email,
            'https://cdn.example.com/pics/default.jpg',
            password
        ]);

        // Insertar en Suscription
        await pg.query(`
            INSERT INTO Suscription (sub_id, profile_id, type, expiration_date)
            VALUES ($1, $2, 'free', NULL)
        `, [Math.floor(Math.random() * 100000), newProfileId]);

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            profileId: newProfileId,
            userId: newUserId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar usuario', details: err });
    }
}