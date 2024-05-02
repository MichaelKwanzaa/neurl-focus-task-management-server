import express from 'express'
import { ensureAuthenticated } from '../middlewares/authentication.middleware'
import { HandleSubscriptionCallback, SubscribeUser } from '../controllers';

const router = express.Router();

router.post('/subscribe', ensureAuthenticated, SubscribeUser)

router.post('/subscription-callback', ensureAuthenticated, HandleSubscriptionCallback)

export { router as SubscriptionRoute }