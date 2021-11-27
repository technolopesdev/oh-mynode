import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';

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
    private async routes(): Promise<void> {
        const allRoutes = await fs.readdir(path.resolve(__dirname, '..', 'routes'));
        allRoutes.forEach(value => {
            const fname = value.split('.')[0];
            if (fname === 'root') {
                this.app.use('/', require('../routes/user').default);
            } else {
                this.app.use(`/${fname}`, require(`../routes/${fname}`).default);
            }
        });
    }
}

export default new App().app;
