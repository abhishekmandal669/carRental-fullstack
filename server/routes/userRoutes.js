import express from 'express';
import { getCars, getUserData, loginuser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginuser);
userRoutes.get('/data', protect, getUserData );
userRoutes.get('/cars', getCars );



export default userRoutes;