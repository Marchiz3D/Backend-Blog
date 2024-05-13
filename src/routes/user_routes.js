import express from "express";
import { getAllUser, login, signUp, logout } from "../controllers/user_contoller.js";
import { refreshToken } from "../controllers/refreshToken.js";

const userRouter = express.Router();

userRouter.get('/', getAllUser);

userRouter.post('/signup', signUp);

userRouter.post('/login', login);

userRouter.get('/token', refreshToken);

userRouter.delete('/logout', logout);

export default userRouter;


