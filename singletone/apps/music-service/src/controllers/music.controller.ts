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
        if (!albumId || !ObjectId.isValid(albumId)) {
            return res.status(400).json({ error: 'ID de álbum inválido' });
        }

        const album = await db.collection('Album').findOne({ _id: new ObjectId(albumId) });

        if (!album) {
            return res.status(404).json({ error: 'Álbum no encontrado' });
        }

        res.json(album);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener álbum', details: err });
    }
};

export const getArtistById = async (req: Request, res: Response) => {
    const { artistId } = req.params;
    const db = await mongoClientPromise;

    try {
        const artist = await db.collection('Artist').findOne({ _id: new ObjectId(artistId) });

        if (!artist) {
            return res.status(404).json({ error: 'Artista no encontrado' });
        }

        let genreName = '—';
        if (artist.genre) {
            const genreDoc = await db.collection('Genre').findOne({ _id: artist.genre });
            genreName = genreDoc?.name || '—';
        }

        res.json({
            ...artist,
            genre: genreName
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener artista', details: err });
    }
};

export const getSongsByArtist = async (req: Request, res: Response) => {
    const { artistId } = req.params;
    const db = await mongoClientPromise;

    try {
        const songs = await db.collection('Song').find({ artist_id: new ObjectId(artistId) }).toArray();
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener canciones del artista', details: err });
    }
};