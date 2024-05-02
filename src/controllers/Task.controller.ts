import { type Request, type Response, type NextFunction } from 'express'
import { ApiResponse } from '../utils/ApiResponse.util';
import { Category, Task, TimerTypes, User } from '../models';
import log from '../utils/Logger.util';
import mongoose from 'mongoose';
import { Subtask } from '../models/Subtask.model';

export const CreateTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const taskData = req.body;

        console.log(taskData);

        const userId = req.user['_id'];

        const exisitingCategory = await Category.findOne({ name: taskData.category.toLowerCase(), user: userId })

        let newCategory = null;

        /**@todo - add some sort of logic to description to add it */
        if(!exisitingCategory){
            newCategory = await Category.create({
                user: userId,
                name: taskData.category.toLowerCase(),
                description: ''
            })
    
            if(!newCategory){
                return new ApiResponse(400, 'Something went wrong creating category', {}).send(res) 
            }
        }

        let subtasksIds = []

        if(taskData.subtasks.length > 0){
            
            for(let i = 0; i < taskData.subtasks.length; i++){
                const subtask = taskData.subtasks[i]
                const newSubTask = await Subtask.create({
                    title: subtask.title,
                    description: subtask.description,
                    isCompleted: subtask.isCompleted,
                    order: subtask.order,
                    estimatedTime: subtask.estimatedTime,
                    notes: subtask.notes
                })

                subtasksIds.push(newSubTask._id)
            }
        }

        const newTask = await Task.create({
                user: userId,
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                category: exisitingCategory ? exisitingCategory._id : newCategory._id,
                isCompleted: taskData.isCompleted,
                startDate: taskData.startDate,
                dueDate: taskData.dueDate,
                estimatedTime: taskData.estimatedTime,
                notes: taskData.notes,
                timer: taskData.timer,
                subtasks: subtasksIds
        })
        
        if(!newTask){
            return new ApiResponse(500, 'Something went wrong', {})
        }

        const user = await User.findById(userId);

        if(!user){
            return new ApiResponse(404, 'Could not find user', {})
        }

        user.tasks.push(newTask._id);
 
        user.save();

        return new ApiResponse(200, 'Task created successfully', {data: newTask}).send(res);
    }catch(error){
        next(error);
    }
}

export const UpdateTask = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const taskId = req.params.id; // Assuming the task ID is passed as a route parameter
        const taskData = req.body;
        const userId = req.user['_id']; // Assuming you have middleware to get the current user from the request

        // Find the task by ID and user ID
        const task = await Task.findOne({ _id: taskId, user: userId });

        if (!task) {
            return new ApiResponse(404, 'Task not found!', {}).send(res);
        }

        // Update the task data
        Object.assign(task, taskData);
        const updatedTask = await task.save();

        return new ApiResponse(200, 'Task updated successfully', {
            data: updatedTask
        }).send(res);
    }catch(error){
        log.error(error);
        next(error);
    }
}

export const GetTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const taskId = req.params.id; // Assuming the task ID is passed as a route parameter
        const task = await Task.findById(taskId);

        if (!task) {
            return new ApiResponse(404, 'Task not found!', {}).send(res);
        }

        return new ApiResponse(200, 'Task found successfully', {
            data: task
        }).send(res);
    }catch(error){
        log.error(error);
        next(error);
    }
}

export const GetAllTasksByUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user['_id']; // Assuming you have middleware to get the current user from the request

        // Find all tasks belonging to the user
        const tasks = await Task.find({ user: userId });

        return new ApiResponse(200, 'Tasks retrieved successfully', {
            data: tasks
        }).send(res);
    }catch(error){
        log.error(error);
        next(error);
    }
}

export const DeleteTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const taskId = req.params.id; // Assuming the task ID is passed as a route parameter
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return new ApiResponse(404, 'Task not found!', {}).send(res);
        }

        return new ApiResponse(200, 'Task deleted successfully', {}).send(res);
    }catch(error){

    }
}