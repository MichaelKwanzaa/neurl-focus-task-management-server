import express from 'express'
import { ensureAuthenticated } from '../middlewares/authentication.middleware'
import { SubscribeUser } from '../controllers';

const router = express.Router();

router.post('/subscribe', ensureAuthenticated, SubscribeUser)

export { router as SubscriptionRoute }