import { type Request, type Response, type NextFunction } from 'express'
import { User } from '../models';
import { ApiResponse } from '../utils/ApiResponse.util';
import redisClient from '../config/redis';

export const GetUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user['_id'];

        let cachedUser;
        try {
          cachedUser = await redisClient.get(`user:${userId}`);
        } catch (error) {
          // Handle the case where the cached data has been invalidated or Redis is unavailable
          console.error('Error retrieving cached user data:', error);
        }

        if (cachedUser) {
            // User data is cached, return it
            console.log({cachedUser})
            return new ApiResponse(200, 'User successfully retrieved', JSON.parse(cachedUser)).send(res);
        }

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

        await redisClient.set(`user:${userId}`, JSON.stringify(user), {
            EX: 3600, // Cache for 1 hour (3600 seconds)
        });

        return new ApiResponse(200, 'User successfully retrieved', { data: user }).send(res);
    } catch (error) {
        console.log(error);
        next(error);
    }
};