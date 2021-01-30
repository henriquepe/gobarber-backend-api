import 'reflect-metadata';

import '@shared/container'
import '@shared/infra/typeorm';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import 'express-async-errors';
import routes from '@shared/infra/http/routes';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';

const app = express();
app.use(cors());

app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {
        if (err instanceof AppError) {
            return response
                .status(err.statusCode)
                .json({ message: err.message, status: 'error' });
        }

        console.error(err);

        return response
            .status(500)
            .json({ status: 'error', message: 'INTERNAL SERVER ERROR' });
    },
);

app.listen(3340, () => {
    console.log('server has been started on port 3340');
});
