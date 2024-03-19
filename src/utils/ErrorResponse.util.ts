import { type Response } from 'express'
import { ApiResponse } from './ApiResponse.util'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const sendErrorResponse = (res: Response, error: Error) => {
  if (process.env.NODE_ENV === 'production') {
    // Send a generic error response in production
    return new ApiResponse(500, 'Internal Server Error', {}).send(res)
  }

  // In development, send detailed error information
  return new ApiResponse(500, 'Internal Server Error', { error: error.message, stack: error.stack }).send(res)
}