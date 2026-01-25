import { Router } from 'express';
export const router = Router();

import {login} from '../controllers/authController.js';

router.post('/login', login);