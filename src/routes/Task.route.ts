import express from 'express'
import { ensureAuthenticated } from '../middlewares/authentication.middleware'
import { CreateTask, DeleteTaskById, GetAllTasksByUser, GetTaskById, UpdateTask } from '../controllers'


const router = express.Router()

router.get('/get-task/:id', ensureAuthenticated, GetTaskById)

router.get('/get-tasks', ensureAuthenticated, GetAllTasksByUser)

router.post('/create-task', ensureAuthenticated, CreateTask)

router.put('/update-task/:id', ensureAuthenticated, UpdateTask)

router.delete('/delete-task/:id', ensureAuthenticated, DeleteTaskById)

export { router as TaskRoute }