import { Router } from 'express';
import {
    getUserArtists,
    getUserAlbums,
    addAlbumToUser,
    rateAlbum,
    getUserSummary
} from '../controllers/library.controller';

const router = Router();

router.get('/library/artists/:userId', getUserArtists);
router.get('/library/albums/:userId', getUserAlbums);
router.post('/library/add-album', addAlbumToUser);
router.post('/library/rate-album', rateAlbum);
router.get('/library/summary/:userId', getUserSummary);

export default router;