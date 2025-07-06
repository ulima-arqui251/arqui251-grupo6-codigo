import { Router } from 'express';
import { getUserById, getUsers, getAllDataUsers, registerUser } from '../controllers/user.controller';

const router = Router();

router.get('/users', getUsers);
router.get('/users/full', getAllDataUsers);
router.get('/users/:id', getUserById);
router.post('/users', registerUser);

export default router;