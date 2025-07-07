import { Router } from 'express';
import {
    getUserById,
    getUsers,
    getAllDataUsers,
    registerUser,
    getUserCredentials
} from '../controllers/user.controller';

const router = Router();

router.get('/', getUsers);
router.get('/full', getAllDataUsers);
router.get('/:id', getUserById);
router.post('/', registerUser);
router.post('/credentials', getUserCredentials);

export default router;