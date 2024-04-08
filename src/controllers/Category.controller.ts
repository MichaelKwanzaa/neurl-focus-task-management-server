import { Category } from '../models';
import { ApiResponse } from '../utils/ApiResponse.util';
import log from '../utils/Logger.util';

import { type Request, type Response, type NextFunction } from 'express'

export const GetCategoriesByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try{ 
        const userCategories = await Category.find({ user: req.user['_id'] })
            .select('-_id -createdAt -updatedAt -__v -user')

            if(!userCategories){
                return new ApiResponse(404, 'Categories not found!', {}).send(res)
            }

            console.log({userCategories})
            return new ApiResponse(200, 'Categories found successfully', {
                data: userCategories
            }).send(res);

    } catch(error){
        log.error(error);
        next(error);
    }
}