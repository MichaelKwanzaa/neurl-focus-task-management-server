import { ApiResponse } from "../utils/ApiResponse.util";
import log from "../utils/Logger.util";

export const ErrorHandler = (err, req, res, next) => {
    console.log(err);
    //log.error(err);

    return new ApiResponse(500, 'Something went wrong', {}).send(res);
}