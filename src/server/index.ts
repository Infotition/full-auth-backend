//* ------------------- DEPENDENCIES ------------------ *\\

//* Node modules
import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';

import dotenv from 'dotenv';

dotenv.config({ path: './config/index.env' });

//* Routes
import authRouter from './routes/auth.route';
import mailRouter from './routes/mail.route';

//* ------------------ CONFIGURATION ------------------ *\\

const PROTOCOL: string = process.env.PROTOCOL || 'http';
const HOST: string = process.env.HOST || 'localhost';
const PORT: string = process.env.PORT || '3000';

const app: Application = express();

//* ------------------- MIDDLEWARES ------------------- *\\

app.use(express.json());

//* --------------- DATABASE CONNECTION --------------- *\\

mongoose
  .connect(process.env.ATLAS_URI || '', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.info('mongo database connection established successfully')
  )
  .catch((error: Error) =>
    console.error('error connecting to database: ', error)
  );

//* --------------------- ROUTES ---------------------- *\\

//* User Authentification routes
app.use('/api/auth/user', authRouter);

//* Google mail routes
app.use('/api/mail', mailRouter);

//* Homepage route
app.get('/', (_req: Request, res: Response) =>
  res.status(200).json({ success: true, message: 'full-auth-server' })
);

//* Default page not found route
app.use((_req: Request, res: Response) =>
  res.status(404).json({ success: false, message: 'page not found' })
);

//* ------------------ START SERVER ------------------- *\\

app.listen(PORT, () =>
  console.info(`server listening on ${PROTOCOL}://${HOST}:${PORT}`)
);
