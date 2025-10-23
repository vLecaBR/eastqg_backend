import dotenv from 'dotenv';
dotenv.config();

export const CLIENT_ID = process.env.ML_CLIENT_ID;
export const CLIENT_SECRET = process.env.ML_CLIENT_SECRET;
export const REFRESH_TOKEN = process.env.ML_REFRESH_TOKEN;
export const USER_ID = process.env.ML_USER_ID;
export const PORT = process.env.PORT || 3000;
