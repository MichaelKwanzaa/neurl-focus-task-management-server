import { type Request, type Response, type NextFunction } from 'express'
import { Settings, User } from '../models'
import { ApiResponse } from '../utils/ApiResponse.util';
import log from '../utils/Logger.util';
import mongoose from 'mongoose';

export const GetSettingsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userSettings = await Settings.findOne({ user: new mongoose.Types.ObjectId(req.user['_id']) })
            .select('-_id -createdAt -__v -updatedAt -user')


        if(!userSettings){
            return new ApiResponse(404, 'Settings not found!', {}).send(res);
        }

        return new ApiResponse(200, 'Settings found successfully', {
            data: userSettings
        }).send(res);

    }catch(error){
        log.error(error)
        next(error)
    }
}

// Create or update settings for the current user
export const UpsertUserSettings = async (req: Request, res: Response, next: NextFunction) => {
  const session = await mongoose.startSession()
  session.startTransaction()  
  
  try {
      const userId = req.user['_id']; // Assuming you have middleware to get the current user from the request
      
      const { pomodoroWorkTime, pomodoroShortBreakTime, pomodoroLongBreakTime, pomodoroIntervalCount } = req.body;
  
      // Use findOneAndUpdate with upsert and new options
      const settings = await Settings.findOneAndUpdate(
        { user: userId }, // Condition to find the document
        {
          user: new mongoose.Types.ObjectId(userId),
          pomodoroWorkTime,
          pomodoroShortBreakTime,
          pomodoroLongBreakTime,
          pomodoroIntervalCount
        },
        {
          upsert: true, // Create a new document if it doesn't exist
          new: true, // Return the updated document
          setDefaultsOnInsert: true // Apply default values on insert
        }
      );

      if(!settings){
        await session.abortTransaction()
        void session.endSession()
        return new ApiResponse(500, 'Something went wrong updating the settings', {}).send(res)
      }
      
      console.log({settings})

      const user = await User.findById(userId);

      if(!user){
        await session.abortTransaction()
        void session.endSession()
        return new ApiResponse(404, 'Cannot find user', {}).send(res)
      }

      user['settings'] = settings['_id'];

      await user.save()
  
      return new ApiResponse(200, 'Settings updated successfully', {}).send(res)
    } catch (error) {
        log.error(error)
        next(error)
    }
  };