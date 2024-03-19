import axios from "axios"
import { log } from "console"
import qs from 'qs'

interface GoogleTokenResult { 
    access_token: string; 
    expires_in: Number; 
    refresh_token: string; 
    scope: string; 
    id_token: string; 
}

interface GoogleUserResult { 
    id: string;
    email: string; 
    verified_email: boolean; 
    name: string; 
    given_name: string; 
    family_name: string; 
    picture: string; 
    locale: string 
}

export const getGoogleOAuthToken = async ({code}: {code: string}): Promise<GoogleTokenResult> => {

    const url = 'https://oauth2.googleapis.com/token'

    const values = {
        code,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        redirect_uri: process.env.CLIENT_REDIRECT_URI,
        grant_type: "authorization_code",
        
    }

    try{
       const res = await axios.post(url, qs.stringify(values),
       {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return res.data;

    } catch(error) {
        log(error, 'failed to fetch google oauth')
    }
}

export const getGoogleUser = async ({id_token, access_token}: { id_token: string, access_token: string}): Promise<GoogleUserResult> => {
    try{
        const res = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, { 
            headers: { Authorization: `Bearer ${id_token}` } 
        })
        return res.data
    } catch(error) {
        log(error, 'failed to fetch google user')

    }
}