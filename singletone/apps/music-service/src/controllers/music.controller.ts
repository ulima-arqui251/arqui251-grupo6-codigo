import { Request, Response } from 'express';
import { mongoClientPromise } from '../db/mongo';
import { ObjectId } from 'mongodb';

export const getArtists = async (_: Request, res: Response) => {
    const db = await mongoClientPromise;
    const result = await db.collection('Artist').find().toArray();
    res.json(result);
};

export const getAlbums = async (_: Request, res: Response) => {
    const db = await mongoClientPromise;
    const result = await db.collection('Album').find().toArray();
    res.json(result);
};

export const getSongs = async (_: Request, res: Response) => {
    const db = await mongoClientPromise;
    const result = await db.collection('Song').find().toArray();
    res.json(result);
};

export const getGenres = async (_: Request, res: Response) => {
    const db = await mongoClientPromise;
    const result = await db.collection('Genre').find().toArray();
    res.json(result);
};

export const getAlbumsByArtist = async (req: Request, res: Response) => {
    const { artistId } = req.params;
    const db = await mongoClientPromise;
    const result = await db.collection('Album').find({ artist_id: new ObjectId(artistId) }).toArray();
    res.json(result);
};

export const getSongsByAlbum = async (req: Request, res: Response) => {
    const { albumId } = req.params;
    const db = await mongoClientPromise;
    const result = await db.collection('Song').find({ album_id: new ObjectId(albumId) }).toArray();
    res.json(result);
};

export const getAlbumById = async (req: Request, res: Response) => {
    const { albumId } = req.params;
    const db = await mongoClientPromise;

    try {
        const album = await db.collection('Album').findOne({ _id: new ObjectId(albumId) });
        if (!album) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        res.json(album);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener álbum', details: err });
    }
};