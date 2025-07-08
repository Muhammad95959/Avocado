import express from "express";
import authMiddleware from "../middleware/auth";
import * as orderController from "../controllers/orderController";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware as express.RequestHandler, orderController.placeOrder);
orderRouter.post("/verify", authMiddleware as express.RequestHandler, orderController.verifyOrder);
orderRouter.get("/userorders", authMiddleware as express.RequestHandler, orderController.userOrders);
orderRouter.get("/list", orderController.listOrders);
orderRouter.patch("/status", orderController.updateStatus);

export default orderRouter;
