import { Router } from 'express';
import {
    getArtists,
    getAlbums,
    getSongs,
    getGenres,
    getAlbumsByArtist,
    getSongsByAlbum,
    getAlbumById
} from '../controllers/music.controller';

const router = Router();

router.get('/music/artists', getArtists);
router.get('/music/albums', getAlbums);
router.get('/music/songs', getSongs);
router.get('/music/genres', getGenres);
router.get('/music/albums/artist/:artistId', getAlbumsByArtist);
router.get('/music/songs/album/:albumId', getSongsByAlbum);
router.get('/music/albums/album/:albumId', getAlbumById);

export default router;