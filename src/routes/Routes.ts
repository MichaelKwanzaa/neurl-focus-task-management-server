import express from 'express'
import { AuthenticationRoute, SessionRoute, UserRoute, SettingsRoute, TaskRoute, CategoryRoute } from './index'
import { SubscriptionRoute } from './Subscription.route'

const router = express.Router()

router.use('/v1/api/authentication', AuthenticationRoute)
router.use('/v1/api/session', SessionRoute)
router.use('/v1/api/user', UserRoute)
router.use('/v1/api/setting', SettingsRoute)
router.use('/v1/api/task', TaskRoute)
router.use('/v1/api/subscription', SubscriptionRoute)
router.use('/v1/api/category', CategoryRoute)


export default router

'http://localhost:5001/v1/api/sessions/oauth/google'