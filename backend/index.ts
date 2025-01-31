import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Express = express();
const PORT = 3000;

app.use(express.json());
app.use(cors({
  origin: 'https://erp-seven-nu.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

app.use('/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
