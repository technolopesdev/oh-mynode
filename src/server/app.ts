import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

class App {
    public app: Application;
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }
    private middlewares(): void {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
    }
    private database(): void {
        const url = process.env.MONGO_URL as string;
        mongoose.connect(url);
    }
    private routes(): void {
        //
    }
}

export default new App().app;
