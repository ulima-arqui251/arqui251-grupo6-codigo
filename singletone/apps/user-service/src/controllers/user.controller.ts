import { Request, Response } from 'express';
import { pg } from '../db/postgres';
import bcrypt from 'bcrypt';

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
    console.log('🔐 Acceso a /users/full - Headers:', req.headers);
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
        const userRes = await pg.query(`SELECT MAX(user_id) AS max_user FROM UserProfile`);
        const lastUserId = userRes.rows[0].max_user || 100;
        const newUserId = lastUserId + 1;

        const profileRes = await pg.query(`SELECT MAX(profile_id) AS max_profile FROM UserProfile`);
        const lastProfileId = profileRes.rows[0].max_profile || 1000;
        const newProfileId = lastProfileId + 1;

        const hashedPassword = bcrypt.hashSync(password, 10);

        await pg.query(`
            INSERT INTO UserProfile (profile_id, user_id, creation_date) 
            VALUES ($1, $2, CURRENT_DATE)
        `, [newProfileId, newUserId]);

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
            'src/assets/default.png',
            hashedPassword
        ]);

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

export async function getUserCredentials(req: Request, res: Response) {
    console.log('📩 POST /users/credentials recibido con body:', req.body);
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Falta el campo email' });
    }

    try {
        const result = await pg.query(`
            SELECT 
                up.user_id,
                bd.mail,
                bd.password,
                s.type AS sub_type
            FROM UserProfile up
            LEFT JOIN BasicData bd ON bd.profile_id = up.profile_id
            LEFT JOIN Suscription s ON s.profile_id = up.profile_id
            WHERE bd.mail = $1
        `, [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener credenciales', details: err });
    }
}

// user.controller.ts (agrega al final)
export async function updateUserProfile(req: Request, res: Response) {
    const { id } = req.params;
    const { name, lastName, picture, password } = req.body;

    try {
        const profileRes = await pg.query(`SELECT profile_id FROM UserProfile WHERE user_id = $1`, [id]);
        if (profileRes.rows.length === 0) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        const profileId = profileRes.rows[0].profile_id;

        if (name) {
            await pg.query(`UPDATE BasicData SET name = $1 WHERE profile_id = $2`, [name, profileId]);
        }
        if (lastName) {
            await pg.query(`UPDATE BasicData SET last_name = $1 WHERE profile_id = $2`, [lastName, profileId]);
        }
        if (picture) {
            await pg.query(`UPDATE BasicData SET picture = $1 WHERE profile_id = $2`, [picture, profileId]);
        }
        if (password) {
            const hashedPassword = bcrypt.hashSync(password, 10);
            await pg.query(`UPDATE BasicData SET password = $1 WHERE profile_id = $2`, [hashedPassword, profileId]);
        }

        res.json({ message: 'Perfil actualizado correctamente' });
    } catch (err) {
        console.error('❌ Error al actualizar perfil:', err);
        res.status(500).json({ error: 'Error interno al actualizar perfil' });
    }
}