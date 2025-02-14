import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import authRoute from './routes/authRoute/authRoutes';
import saleRoute from './routes/salesRoute/salesRoute'

dotenv.config();

const app: Express = express();
const PORT = 5000;

app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

app.options('*', cors()); // Handle preflight requests for all routes

app.use('/auth/', authRoute);
app.use('/sale/', saleRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
