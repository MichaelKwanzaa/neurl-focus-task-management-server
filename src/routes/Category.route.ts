import express from 'express';
import { ensureAuthenticated } from '../middlewares/authentication.middleware'
import { GetCategoriesByUserId } from '../controllers';

const router = express.Router()

router.get('/get-categories', ensureAuthenticated, GetCategoriesByUserId);

export { router as CategoryRoute }
