import express from 'express';
import { register, login, getMe, updateProfile, logout } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate, schemas } from '../middleware/validation';

const router = express.Router();

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/profile', authenticate, validate(schemas.updateProfile), updateProfile);

export default router;