import dotenv from 'dotenv';
dotenv.config();

export const sendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY as string,
  senderEmail: process.env.DEFAULT_FROM_EMAIL as string,
};
