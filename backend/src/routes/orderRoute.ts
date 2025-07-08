import express from "express";
import authMiddleware from "../middleware/auth";
import * as orderController from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, orderController.placeOrder);
orderRouter.post("/verify", authMiddleware, orderController.verifyOrder);
orderRouter.get("/userorders", authMiddleware, orderController.userOrders);
orderRouter.get("/list", orderController.listOrders);

export default orderRouter;
