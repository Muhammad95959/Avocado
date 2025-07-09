import * as cartController from "../controllers/cartController";
import express from "express";
import authMiddleware from "../middleware/auth";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware as express.RequestHandler, cartController.addToCart);
cartRouter.post("/remove", authMiddleware as express.RequestHandler, cartController.removeFromCart);
cartRouter.get("/get", authMiddleware as express.RequestHandler, cartController.getCart);
cartRouter.patch("/update", authMiddleware as express.RequestHandler, cartController.updateCartData);

export default cartRouter;
