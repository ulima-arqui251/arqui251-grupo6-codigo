import { Router } from 'express';
import { getUsers, getAllDataUsers } from '../controllers/user.controller';

const router = Router();

router.get('/users', getUsers);
router.get('/users/full', getAllDataUsers);

export default router;