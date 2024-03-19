import express from 'express'
import { HandleRefreshToken, LoginUser, LoginUserGoogle } from '../controllers'
import passport from 'passport'


const router = express.Router()

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), LoginUser)

router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); 

router.get('/oauth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), LoginUserGoogle);

router.get('/refresh-token', HandleRefreshToken)

export { router as AuthenticationRoute } 