import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/error.handler";
import { connectRedisClient } from "./config/redis.config";
import { connectMongoDB } from "./config/mongo.config";
import { BookRouter } from './routes/book.route'

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3009;

app.use(express.json());

app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const router = express.Router();

app.use("/v1/api", BookRouter(router)); 

app.listen(port, async() => {
  await connectRedisClient();
  await connectMongoDB();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
