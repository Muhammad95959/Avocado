import express from "express";
import * as userController from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", userController.registerUser as express.RequestHandler);
userRouter.post("/login", userController.loginUser as express.RequestHandler);

export default userRouter;
