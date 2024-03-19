import { ApiResponse } from "../utils/ApiResponse.util";

export const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } 

    return new ApiResponse(401, 'Unauthorized', {}).send(res);
}