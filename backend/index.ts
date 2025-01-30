import express, { Express, NextFunction, Request, Response } from 'express';
import prisma from './prisma';
import bcrypt from 'bcryptjs';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { authentication, ExpressRequest } from './middlewares/authMiddleware';
import dotenv from 'dotenv'
import cors from 'cors'


dotenv.config()


const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not defined');
}

const generatejwt = (user: User): string => {
    return sign({ email: user.email }, JWT_SECRET);
  };

const app: Express = express();
app.use(express.json());
app.use(cors({
  origin: 'https://erp-seven-nu.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

const PORT = 3000;


app.post('/auth/signup', async (req: Request, res: Response) => {
  try {
    const { password, email, username } = req.body;


    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    if (existingUser) {
      res.status(400).json({ message: 'Email is already in use' });
      return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword }
    });

    const { password: _password, ...userWithoutPassword } = user;
    res.status(201).json({ ...userWithoutPassword, token: generatejwt(user) });
  } catch (err) {
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


app.post('/auth/signin', async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ message: 'Incorrect password' });
      return;
    }

    res.status(200).json({ message: 'Signed in successfully', token: generatejwt(user) });
  } catch (err) {
    res.status(500).json({ message: 'Credentials do not match or server error' });
  }
});

app.get('/auth/me', authentication, async (req: ExpressRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    res.status(200).json(req.user);
  } catch (err) {
    next(err); 
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
