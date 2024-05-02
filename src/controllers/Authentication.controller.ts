import { type Request, type Response, type NextFunction, CookieOptions } from 'express'
import { ApiResponse } from '../utils/ApiResponse.util'
import { signJwt, verifyJwt } from '../utils/Jwt.util';
import { createSession } from '../services';
import { Session, User } from '../models';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'

const accessTokenCookieOptions: CookieOptions = {
    maxAge: 900000, // 15 mins
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
};
  
const refreshTokenCookieOptions: CookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: 3.154e10, // 1 year
};

export const RegisterUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(parseInt(process.env.SALTWORKFACTOR))
    
        const hash = await bcrypt.hash(password, salt)

        const user = await User.findOneAndUpdate(
            { email: email },
            {
                $setOnInsert: {
                    name: name,
                    email: email,
                    picture: null,
                    password: hash,
                    userId: uuidv4(),
                    role: 'user'
                },
            },
            { upsert: true, new: true }
        )

        console.log({user});

        if(!user){
            return new ApiResponse(500, 'Something went wrong registering this user', {}).send(res);
        }

        return new ApiResponse(200, 'Successfully created user', {}).send(res);
    } catch(error) {
        console.log(error);
    }
}

export const LoginUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const user = req.user as any;

        const session = await createSession(user['_id'], req.get("user-agent") || "");

        // create an access token
        const accessToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: process.env.ACCESSTOKENTIME } // 15 minutes
        );

        // create a refresh token
        const refreshToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: process.env.REFRESHTOKENTIME } // 1 year
        ); 
        
        // set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);

        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
        
        return new ApiResponse(200, 'Successfully logged in', { accessToken, refreshToken }).send(res);
    } catch(error) {
        console.log(error);
    }
}

export const LoginUserGoogle = async (req: Request, res: Response, next: NextFunction) => {
    try{

        const user = req.user as any

        const session = await createSession(user['_id'], req.get("user-agent") || "");

        // create an access token
        const accessToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: process.env.ACCESSTOKENTIME } // 15 minutes
        );

        // create a refresh token
        const refreshToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: process.env.REFRESHTOKENTIME } // 1 year
        ); 
        
        // set cookies
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);

        res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);
        res.redirect(process.env.CLIENT_URI + `/auth-call-back-google?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`);

        return new ApiResponse(200, 'Successfully logged in', { data: accessToken }).send(res);
    } catch(error) {
        console.log('error')
    }
}

export const HandleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const refreshToken = req.cookies['refreshToken']
        
        if(!refreshToken){
            return new ApiResponse(401, 'Unauthorized Access', {}).send(res)
        }

        const payload = verifyJwt(refreshToken);


        const session = await Session.findById(payload['session'])

        if(!session || !session.valid){
            return new ApiResponse(403, 'Forbidden', {}).send(res);
        }        

        const user = await User.findById(payload['_id']);

        if (!user) {
            return new ApiResponse(404, 'User not found', {}).send(res);
        }

        const accessToken = signJwt(
            { ...user.toJSON(), session: session._id },
            { expiresIn: process.env.ACCESSTOKENTIME } // 15 minutes
        );
      
        res.cookie("accessToken", accessToken, accessTokenCookieOptions);

        return new ApiResponse(200, 'Access token refreshed', { accessToken }).send(res);
    } catch (error) {

    }
}

export const LogOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.cookies['accessToken'];
        
        const refreshToken = req.cookies['refreshToken'];
        
        if (!accessToken || !refreshToken) {
            return new ApiResponse(401, 'Unauthorized', {}).send(res);
        }

        const payload = verifyJwt(refreshToken);
        const session = await Session.findByIdAndDelete(payload['session']);

        if (!session) {
            return new ApiResponse(404, 'Session not found', {}).send(res);
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        return new ApiResponse(200, 'Logout successful', {}).send(res); 
    } catch (error) {
        console.error(error);
        return new ApiResponse(500, 'Internal server error', {}).send(res);
    }
};