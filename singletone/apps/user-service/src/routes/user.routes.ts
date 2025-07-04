import { Router } from 'express';
import { getUserById, getUsers, getAllDataUsers } from '../controllers/user.controller';

const router = Router();

router.get('/users', getUsers);
router.get('/users/full', getAllDataUsers);
router.get('/users/:id', getUserById);

export default router;