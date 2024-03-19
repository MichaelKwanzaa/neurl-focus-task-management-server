import express from 'express'
import { GetUser} from '../controllers'
import { ensureAuthenticated } from '../middlewares/authentication.middleware'


const router = express.Router()

router.get('/get-user', ensureAuthenticated, GetUser);

export { router as UserRoute }