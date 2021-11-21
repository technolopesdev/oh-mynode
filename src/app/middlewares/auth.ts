import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default function auth(req: Request, res: Response, next: NextFunction): Response | void {
    const { authorization } = req.headers;
    if (!authorization) return res.send({
        success: false,
        message: 'No token was sent!'
    });
    const tksepr = authorization.split(' ');
    if (tksepr.length !== 2) return res.send({
        success: false,
        message: 'Invalid token!'
    });
    const [key, token] = tksepr;
    if (key !== 'Bearer') return res.send({
        success: false,
        message: 'Invalid token!'
    });
    const secret = process.env.SECRET as string;
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.send({
            success: false,
            message: 'Invalid or expired token!'
        });
        if (!decoded) return res.send({
            success: false,
            message: 'Invalid or expired token!'
        });
        req.userId = decoded.id;
        next();
    });
}
