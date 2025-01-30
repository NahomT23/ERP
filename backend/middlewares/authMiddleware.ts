import { User } from "@prisma/client";
import { verify } from "jsonwebtoken";
import prisma from "../prisma";
import { NextFunction, Response, Request } from "express";
import dotenv from 'dotenv'

dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

export interface ExpressRequest extends Request {
    user?: User;
}

export const authentication = async (req: ExpressRequest, res: Response, next: NextFunction): Promise<void> => {
    
    if (!req.header('Authorization')) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(400).json({ message: 'Token not found' });
        return;
    }

    try {
        const decoded = verify(token, JWT_SECRET) as { email: string };
        const user = await prisma.user.findUnique({
            where: {
                email: decoded.email,
            },
        });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        console.error(err);  
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
