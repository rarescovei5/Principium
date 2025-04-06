// Very Important Import
import './config/envVars';
// Dependencies
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Source Files
import corsOptions from './config/corsOptions';

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

export default app;
