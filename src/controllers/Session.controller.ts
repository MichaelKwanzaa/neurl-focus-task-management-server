import { type Request, type Response, type NextFunction, type CookieOptions } from 'express'
import jwt from 'jsonwebtoken'
import { createSession, getGoogleOAuthToken, getGoogleUser } from '../services'
import { ApiResponse } from '../utils/ApiResponse.util'
import { sendErrorResponse } from '../utils/ErrorResponse.util'
import { User } from '../models'
import { signJwt } from '../utils/Jwt.util'

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

export const GoogleOAuthHandler = async (req: Request, res: Response, next: NextFunction) => {
    try{
        //get the code from the qs 
        const code = req.query.code as string

        // get the id and access token with the code 
        const { id_token, access_token } = await getGoogleOAuthToken({code})
      
        //get user with tokens 
        const googleUser = await getGoogleUser({id_token, access_token})

        if(!googleUser.verified_email){
            return new ApiResponse(403, 'Your google account is not verified', {}).send(res)
        }
        //upsert the user 
        const user = await User.findOneAndUpdate(
            { email: googleUser.email }, 
            { email: googleUser.email, name: googleUser.name, picture: googleUser.picture }, 
            {upsert:true, new: true})

        //create a session
        const session = await createSession(user._id, req.get("user-agent") || "");

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
    
        // redirect back to client
        res.redirect(process.env.CLIENT_URI);
    } catch(error) {

    }
}


