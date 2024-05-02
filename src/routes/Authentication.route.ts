import express from 'express'
import { HandleRefreshToken, LoginUser, LoginUserGoogle, LogOut, RegisterUser } from '../controllers'
import passport from 'passport'
import { ensureAuthenticated } from '../middlewares/authentication.middleware'


const router = express.Router()

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), LoginUser)

router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); 

router.get('/oauth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), LoginUserGoogle);

router.get('/refresh-token', HandleRefreshToken)

router.get('/logout', ensureAuthenticated, LogOut)

router.post('/register', RegisterUser)

export { router as AuthenticationRoute } 