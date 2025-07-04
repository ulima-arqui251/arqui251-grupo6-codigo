import { Request, Response } from 'express';
import { mongoClientPromise } from '../db/mongo';
import axios from 'axios';
import { ObjectId } from 'mongodb';

export const getUserArtists = async (req: Request, res: Response) => {
    const db = await mongoClientPromise;
    const { userId } = req.params;
    const result = await db.collection('ArtistUser').find({ user_id: userId }).toArray();
    res.json(result);
};

export const getUserAlbums = async (req: Request, res: Response) => {
    const db = await mongoClientPromise;
    const { userId } = req.params;
    const result = await db.collection('AlbumUser').find({ user_id: userId }).toArray();
    res.json(result);
};

export const addAlbumToUser = async (req: Request, res: Response) => {
    try {
        const db = await mongoClientPromise;
        const { userId, artistId, albumId } = req.body;

        const artistUser = await db.collection('ArtistUser').findOne({ user_id: userId, artist_id: artistId });

        if (artistUser) {
            await db.collection('ArtistUser').updateOne(
                { user_id: userId, artist_id: artistId },
                { $inc: { total_albums: 1 } }
            );
        } else {
            await db.collection('ArtistUser').insertOne({
                _id: new ObjectId(),
                user_id: userId,
                artist_id: artistId,
                rank_state: 'to_value',
                total_albums: 1,
                completed_albums: 0
            });
        }

        await db.collection('AlbumUser').insertOne({
            _id: new ObjectId(),
            album_id: albumId,
            user_id: userId,
            artist_id: artistId,
            rank_date: new Date(),
            rank_state: 'to_value'
        });

        // 👇 Asegurar que rank_state del artista sea "to_value" si tiene álbumes pendientes
        const updated = await db.collection('ArtistUser').findOne({ user_id: userId, artist_id: artistId });
        if (updated && updated.completed_albums < updated.total_albums) {
            await db.collection('ArtistUser').updateOne(
                { user_id: userId, artist_id: artistId },
                { $set: { rank_state: 'to_value' } }
            );
        }

        res.json({ message: 'Álbum agregado a la biblioteca del usuario.' });
    } catch (err) {
        console.error('Error al agregar álbum:', err);
        res.status(500).json({ error: 'Error interno al agregar álbum', details: err });
    }
};

export const rateAlbum = async (req: Request, res: Response) => {
    try {
        const db = await mongoClientPromise;
        const { userId, artistId, albumId, ratings } = req.body;

        // 1. Obtener canciones reales del álbum
        const musicServiceUrl = process.env.MUSIC_SERVICE_URL;
        const response = await axios.get(`${musicServiceUrl}/api/music/songs/album/${albumId}`);
        const realSongs = response.data;

        if (!realSongs || realSongs.length === 0) {
            return res.status(400).json({ error: 'Álbum no encontrado o sin canciones' });
        }

        // 2. Validar que se están valorando todas
        if (ratings.length !== realSongs.length) {
            return res.status(400).json({ error: 'Debe valorar todas las canciones del álbum' });
        }

        // 3. Guardar cada valoración
        for (const rating of ratings) {
            await db.collection('SongUser').insertOne({
                _id: new ObjectId(),
                user_id: userId,
                song_id: rating.songId,
                album_id: albumId,
                artist_id: artistId,
                score: rating.score
            });
        }

        // 4. Marcar el álbum como valorado
        await db.collection('AlbumUser').updateOne(
            { user_id: userId, album_id: albumId },
            {
                $set: {
                    rank_state: 'valued',
                    rank_date: new Date()
                }
            }
        );

        // 5. Incrementar completados y actualizar estado del artista
        await db.collection('ArtistUser').updateOne(
            { user_id: userId, artist_id: artistId },
            { $inc: { completed_albums: 1 } }
        );

        const artistUser = await db.collection('ArtistUser').findOne({ user_id: userId, artist_id: artistId });

        if (artistUser && artistUser.completed_albums >= artistUser.total_albums) {
            await db.collection('ArtistUser').updateOne(
                { user_id: userId, artist_id: artistId },
                { $set: { rank_state: 'valued' } }
            );
        }

        res.json({ message: 'Álbum valorado correctamente con puntuaciones exactas.' });
    } catch (error) {
        console.error('Error al valorar álbum:', error);
        res.status(500).json({ error: 'Error interno al valorar álbum', details: error });
    }
};