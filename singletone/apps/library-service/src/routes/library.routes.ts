import { Router } from 'express';
import {
    getUserArtists,
    getUserAlbums,
    addAlbumToUser,
    rateAlbum,
    getUserSummary,
    updateAlbumRating,
    getUserAlbumRatings
} from '../controllers/library.controller';

const router = Router();

router.get('/library/artists/:userId', getUserArtists);
router.get('/library/albums/:userId', getUserAlbums);
router.post('/library/add-album', addAlbumToUser);
router.post('/library/rate-album', rateAlbum);
router.get('/library/summary/:userId', getUserSummary);
router.post('/library/update-album-rating', updateAlbumRating);
router.get('/library/songs/:userId/:albumId', getUserAlbumRatings);

export default router;