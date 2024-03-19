import express from 'express'
import { GoogleOAuthHandler } from '../controllers'


const router = express.Router()

router.get('/oauth/google', GoogleOAuthHandler)

export { router as SessionRoute }
