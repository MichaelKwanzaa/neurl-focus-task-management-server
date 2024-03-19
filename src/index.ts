import express from 'express';
import * as dotenv from 'dotenv';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/Routes';
import { connectDB } from './config';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import log from './utils/Logger.util';
import setupPassport from './middlewares/passport.middleware';
import { ErrorHandler } from './middlewares/error-handler.middleware';

dotenv.config();

const app: express.Application = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

try {
  app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URI
  }));
  app.use(express.json({ limit: '5kb' }));
  app.use(cookieParser());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(session({
    secret: "secret",
    resave: false ,
    saveUninitialized: true ,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  setupPassport(); // Invoke Passport middleware setup
  
  connectDB();

  app.use(routes);

  app.use(ErrorHandler);

  const expressServer = server.listen(PORT, () => {
    console.clear();
    log.info(`Server is running on port: ${PORT}`);
  });

  process.on('unhandledRejection', (reason, promise) => {
    log.error(`Could not connect to: ${PORT}`);
    expressServer.close(() => process.exit(1));
  });
} catch (error: any) {
  console.log(error.message, ' - index.ts error');
}
