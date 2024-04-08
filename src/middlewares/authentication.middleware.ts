import { Session } from '../models';
import { ApiResponse } from "../utils/ApiResponse.util";
import { verifyJwt } from "../utils/Jwt.util";

export const ensureAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.cookies['accessToken'];

    if (!accessToken) {
        return new ApiResponse(401, 'Unauthorized', {}).send(res);
    }

    const payload = verifyJwt(accessToken);

    const session = await Session.findById(payload['session'])


    if (!session || !session.valid) {
        return new ApiResponse(403, 'Forbidden', {}).send(res);
    }

    req.user = payload;
    next();
} catch (error) {
    return new ApiResponse(401, 'Unauthorized', {}).send(res);
}
}