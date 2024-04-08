import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'


export default function setupPassport(): void {

  const localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  const googleStrategy = new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CLIENT_REDIRECT_URI,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      let randomstring = Math.random().toString(36).slice(-8);

      const salt = await bcrypt.genSalt(parseInt(process.env.SALTWORKFACTOR))
  
      const hash = await bcrypt.hashSync(randomstring, salt)

      const user = await User.findOneAndUpdate(
        { email: profile.emails[0].value },
        {
          $setOnInsert: {
            name: profile.displayName,
            email: profile.emails[0].value,
            picture: profile.photos[0].value,
            password: hash,
            userId: uuidv4(),
            role: 'user'
          },
        },
        { upsert: true, new: true }
      );
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  });

  passport.use(localStrategy);
  passport.use(googleStrategy);

  passport.serializeUser((user: any, done) => {
    done(null, {id: user._id});
  });

  passport.deserializeUser(async (id, done) => {
    done(null, id);
  });
}
