import { Router } from 'express';
import {
    getUserArtists,
    getUserAlbums,
    addAlbumToUser,
    rateAlbum
} from '../controllers/library.controller';

const router = Router();

router.get('/library/artists/:userId', getUserArtists);
router.get('/library/albums/:userId', getUserAlbums);
router.post('/library/add-album', addAlbumToUser);
router.post('/library/rate-album', rateAlbum);

export default router;