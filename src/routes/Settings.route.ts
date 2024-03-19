import express from 'express'
import { ensureAuthenticated } from '../middlewares/authentication.middleware'
import { GetSettingsByUserId, UpsertUserSettings } from '../controllers'

const router = express.Router()

router.post('/upsert-setting', ensureAuthenticated, UpsertUserSettings)
router.get('/get-setting', ensureAuthenticated, GetSettingsByUserId)

export { router as SettingsRoute }