import { Router } from 'express';
import { authController } from '../controller/auth.controller';

export const authRouter = Router();

authRouter.route('/register').post(authController.signUp);
authRouter.route('/login').post(authController.signIn);
authRouter.route('/forgot-password').post(authController.forgotPassword);
authRouter.route('/reset-password/:token').patch(authController.resetPassword);
