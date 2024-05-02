import { type Request, type Response, type NextFunction } from 'express'
import { User } from '../models';
import { ApiResponse } from '../utils/ApiResponse.util';

export const GetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user['_id'];
        const user = await User.findById(userId)
            .select('-_id -createdAt -updatedAt -__v -password')
            .populate({
                path: 'settings',
                select: '-_id -createdAt -updatedAt -user -__v',
            })
            .populate({
                path: 'tasks',
                select: '-createdAt -updatedAt -__v -user',
                populate: [
                    {
                        path: 'category',
                        select: '-_id -createdAt -updatedAt -user -__v',
                    },
                    {
                        path: 'timer',
                        select: '-_id -createdAt -updatedAt -__v',
                    },
                    {
                        path: 'subtasks',
                        select: '-_id -createdAt -updatedAt -__v',
                    },
                ],
            });

        if (!user) {
            return new ApiResponse(404, 'User not found', {}).send(res);
        }

        return new ApiResponse(200, 'User successfully retrieved', { data: user }).send(res);
    } catch (error) {
        console.log(error);
        next(error);
    }
};