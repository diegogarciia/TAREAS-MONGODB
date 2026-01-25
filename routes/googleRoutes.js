import { Router } from 'express';
export const router = Router();

import {googleSignin} from '../controllers/authController.js';

router.post('/google', googleSignin);