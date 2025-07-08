import { Request, Response } from 'express';
import { mongoClientPromise } from '../db/mongo';
import axios from 'axios';
import { ObjectId } from 'mongodb';
import { getUserSubscriptionType } from '../utils/subscription';
import { redis as redisLibrary } from '../db/redis';

export const getUserArtists = async (req: Request, res: Response) => {
    const db = await mongoClientPromise;
    const { userId } = req.params;
    const result = await db.collection('ArtistUser').find({ user_id: parseInt(userId) }).toArray();
    res.json(result);
};

export const getUserAlbums = async (req: Request, res: Response) => {
    const db = await mongoClientPromise;
    const { userId } = req.params;
    const result = await db.collection('AlbumUser').find({ user_id: parseInt(userId) }).toArray();
    res.json(result);
};

export const getUserAlbumRatings = async (req: Request, res: Response) => {
    try {
        const db = await mongoClientPromise;
        const { userId, albumId } = req.params;

        const ratings = await db.collection('SongUser').find({
            user_id: parseInt(userId),
            album_id: albumId
        }).toArray();

        const simplified = ratings.map(r => ({ song_id: r.song_id, score: r.score }));
        res.json(simplified);
    } catch (err) {
        console.error('❌ Error al obtener valoraciones de canciones:', err);
        res.status(500).json({ error: 'Error al obtener valoraciones de canciones' });
    }
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

        const updated = await db.collection('ArtistUser').findOne({ user_id: userId, artist_id: artistId });
        if (updated && updated.completed_albums < updated.total_albums) {
            await db.collection('ArtistUser').updateOne(
                { user_id: userId, artist_id: artistId },
                { $set: { rank_state: 'to_value' } }
            );
        }

        res.json({ message: 'Álbum agregado a la biblioteca del usuario.' });
    } catch (err) {
        console.error('❌ Error al agregar álbum:', err);
        res.status(500).json({ error: 'Error interno al agregar álbum', details: err });
    }
};

const getCurrentMonthKey = (userId: number) => {
    const now = new Date();
    const yearMonth = `${now.getFullYear()}-${now.getMonth() + 1}`;
    return `ratings:${userId}:${yearMonth}`;
};

export const rateAlbum = async (req: Request, res: Response) => {
    try {
        const db = await mongoClientPromise;
        const { userId, artistId, albumId, ratings } = req.body;
        const token = req.headers.authorization || '';
        const musicServiceUrl = process.env.MUSIC_SERVICE_URL;

        const subscriptionType = await getUserSubscriptionType(userId);

        if (subscriptionType === 'free') {
            const key = getCurrentMonthKey(userId);
            const currentCount = parseInt(await redisLibrary.get(key) || '0');

            if (currentCount >= 10) {
                return res.status(403).json({ error: 'Has alcanzado el límite de 10 valoraciones este mes.' });
            }

            await redisLibrary.set(key, (currentCount + 1).toString(), 'EX', 60 * 60 * 24 * 31);
        }

        const response = await axios.get(`${musicServiceUrl}/music/songs/album/${albumId}`, {
            headers: { Authorization: token }
        });

        const realSongs = response.data;
        if (!realSongs || realSongs.length === 0) {
            return res.status(400).json({ error: 'Álbum no encontrado o sin canciones' });
        }

        if (ratings.length !== realSongs.length) {
            return res.status(400).json({ error: 'Debe valorar todas las canciones del álbum' });
        }

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

        await db.collection('AlbumUser').updateOne(
            { user_id: userId, album_id: albumId },
            { $set: { rank_state: 'valued', rank_date: new Date() } }
        );

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

        res.json({ message: 'Álbum valorado correctamente.' });
    } catch (error: any) {
        console.error('❌ Error al valorar álbum:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Error interno al valorar álbum', details: error });
    }
};

export const getUserSummary = async (req: Request, res: Response) => {
    const db = await mongoClientPromise;
    const { userId } = req.params;
    const musicServiceUrl = process.env.MUSIC_SERVICE_URL;
    const token = req.headers.authorization;

    try {
        const [artistLinks, albumLinks, songLinks] = await Promise.all([
            db.collection('ArtistUser').find({ user_id: parseInt(userId) }).toArray(),
            db.collection('AlbumUser').find({ user_id: parseInt(userId) }).toArray(),
            db.collection('SongUser').find({ user_id: parseInt(userId) }).toArray()
        ]);

        const [artistsRes, albumsRes] = await Promise.all([
            axios.get(`${musicServiceUrl}/music/artists`, { headers: { Authorization: token || '' } }),
            axios.get(`${musicServiceUrl}/music/albums`, { headers: { Authorization: token || '' } })
        ]);

        const artistsMap = Object.fromEntries(artistsRes.data.map((a: any) => [a._id, a]));
        const albumsMap = Object.fromEntries(albumsRes.data.map((a: any) => [a._id, a]));

        const userAlbums = await Promise.all(albumLinks.map(async (entry: any) => {
            const album = albumsMap[entry.album_id];
            if (!album) return null;

            let average_score = null;
            if (entry.rank_state === 'valued') {
                const ratings = await db.collection('SongUser')
                    .find({ user_id: parseInt(userId), album_id: entry.album_id })
                    .toArray();
                if (ratings.length > 0) {
                    const total = ratings.reduce((acc, r) => acc + r.score, 0);
                    average_score = Math.round(total / ratings.length);
                }
            }

            return {
                albumId: album._id,
                title: album.title,
                cover_url: album.cover_url,
                rank_state: entry.rank_state,
                average_score: average_score ?? '—'
            };
        }));

        const userArtists = artistLinks.map((entry: any) => {
            const artist = artistsMap[entry.artist_id];
            return {
                artistId: artist?._id,
                name: artist?.name,
                picture_url: artist?.picture_url
            };
        }).filter(Boolean);

        const subscriptionType = await getUserSubscriptionType(parseInt(userId));
        let remainingRatings = null;
        if (subscriptionType === 'free') {
            const key = getCurrentMonthKey(parseInt(userId));
            const used = parseInt(await redisLibrary.get(key) || '0');
            remainingRatings = 10 - used;
        }

        res.json({
            artistCount: userArtists.length,
            albumCount: userAlbums.filter(Boolean).length,
            songCount: songLinks.length,
            albums: userAlbums.filter(Boolean),
            artists: userArtists,
            remainingRatings
        });
    } catch (err: any) {
        console.error('❌ Error en summary:', err.message);
        res.status(500).json({ error: 'Error al obtener summary', details: err });
    }
};

export const updateAlbumRating = async (req: Request, res: Response) => {
    try {
        const db = await mongoClientPromise;
        const { userId, artistId, albumId, ratings } = req.body;
        const token = req.headers.authorization || '';
        const musicServiceUrl = process.env.MUSIC_SERVICE_URL;

        const subscriptionType = await getUserSubscriptionType(userId);
        if (subscriptionType === 'free') {
            const key = getCurrentMonthKey(userId);
            const currentCount = parseInt(await redisLibrary.get(key) || '0');
            if (currentCount >= 10) {
                return res.status(403).json({ error: 'Límite de valoraciones alcanzado' });
            }
            await redisLibrary.set(key, (currentCount + 1).toString(), 'EX', 60 * 60 * 24 * 31);
        }

        const response = await axios.get(`${musicServiceUrl}/music/songs/album/${albumId}`, {
            headers: { Authorization: token }
        });

        const realSongs = response.data;
        if (!realSongs || realSongs.length === 0 || ratings.length !== realSongs.length) {
            return res.status(400).json({ error: 'Datos incompletos' });
        }

        for (const rating of ratings) {
            await db.collection('SongUser').updateOne(
                {
                    user_id: userId,
                    song_id: rating.songId,
                    album_id: albumId
                },
                {
                    $set: {
                        artist_id: artistId,
                        score: rating.score
                    }
                },
                { upsert: true }
            );
        }

        await db.collection('AlbumUser').updateOne(
            { user_id: userId, album_id: albumId },
            { $set: { rank_state: 'valued' } }
        );

        res.json({ message: 'Valoración actualizada.' });
    } catch (error: any) {
        console.error('❌ Error al actualizar valoración:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Error interno al actualizar valoración', details: error });
    }
};