import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import mongoose from 'mongoose';
import { globalErrorHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth.router';
import { storeRouter } from './routes/store.router';
import { productRouter } from './routes/product.router';
import { AppError } from './utils/appError';
dotenv.config();
export const app: Express = express();

const DB = process.env.CONNECTION_STRING || '';

app.use(express.json());
app.use(cors());

//security http headers
app.use(helmet());

//rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, //max of 100 requests
  message:
    'Too many requests from this IP address, please try again in 15 minutes',
});
app.use('/api/v1', limiter);

//data sanitization against noSql query injection
app.use(mongoSanitize());

//api routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/store', storeRouter);
app.use('/api/v1/product', productRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  req.requestTime = new Date().toISOString();
  console.log('Request Time:', req.requestTime);
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'welocome to your shopping community',
  });
});

app.get('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

//global error-handling middleware
app.use(globalErrorHandler);

mongoose
  .connect(DB)
  .then(() => console.log('DB connection successful!'))
  .catch((err: any) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
