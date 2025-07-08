import { Router } from 'express';
import {
    getArtists,
    getAlbums,
    getSongs,
    getGenres,
    getAlbumsByArtist,
    getSongsByAlbum,
    getAlbumById,
    getArtistById,
    getSongsByArtist
} from '../controllers/music.controller';

const router = Router();

router.get('/music/artists', getArtists);
router.get('/music/albums', getAlbums);
router.get('/music/songs', getSongs);
router.get('/music/genres', getGenres);
router.get('/music/albums/artist/:artistId', getAlbumsByArtist);
router.get('/music/songs/album/:albumId', getSongsByAlbum);
router.get('/music/albums/album/:albumId', getAlbumById);
router.get('/music/artists/:artistId', getArtistById);
router.get('/music/songs/artist/:artistId', getSongsByArtist);

export default router;