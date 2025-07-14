import { Router } from 'express';
import {
    getUserById,
    getUsers,
    getAllDataUsers,
    registerUser,
    getUserCredentials,
    updateUserProfile
} from '../controllers/user.controller';

const router = Router();

// ✅ Nombres claros sin ambigüedad
router.get('/all', getUsers);                     // GET /users/all
router.get('/full', getAllDataUsers);             // GET /users/full
router.get('/by-id/:id', getUserById);            // GET /users/by-id/:id
router.post('/register', registerUser);           // POST /users/register
router.post('/credentials', getUserCredentials);  // POST /users/credentials
router.put('/update/:id', updateUserProfile); // PUT /users/update/:id

export default router;