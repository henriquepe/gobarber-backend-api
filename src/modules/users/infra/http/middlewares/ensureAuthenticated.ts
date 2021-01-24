import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';

interface TokenPayload {
    sub: string;
    iat: string;
    exp: number;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token is missing', 401);
    }

    const [, token] = authHeader.split(' ');

    const { secret } = authConfig.jwt;

    try {
        const decoded = verify(token, secret);

        const { sub } = decoded as TokenPayload;

        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Invalid Token', 401);
    }
}
