import * as cartController from "../controllers/cartController";
import express from "express";
import authMiddleware from "../middleware/auth";

const cartRouter = express.Router();

cartRouter.post("/add", authMiddleware, cartController.addToCart);
cartRouter.post("/remove", authMiddleware, cartController.removeFromCart);
cartRouter.get("/get", authMiddleware, cartController.getCart);
cartRouter.patch("/update", authMiddleware, cartController.updateCartData);

export default cartRouter;
