import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user_routes.js";
import blogRouter from "./routes/blog_routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }))

app.use('/api/user', userRouter);

app.use('/api/blog', blogRouter);

app.listen(port, () => console.log(`Sever is running on port: ${port}`));

