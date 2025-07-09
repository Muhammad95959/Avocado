import { Request, Response } from "express";
import orderModel from "../models/orderModel";
import userModel from "../models/userModel";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET) throw new Error("STRIPE_SECRET env variable is not set");
const stripe = new Stripe(process.env.STRIPE_SECRET);

export async function placeOrder(req: Request, res: Response) {
  try {
    const frontend_url = process.env.FRONTEND_URL;
    if (!frontend_url) throw new Error("FRONTEND_URL environment variable is not set");
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    const line_items = req.body.items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Delivery Charges" },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify.html?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify.html?success=false&orderId=${newOrder._id}`,
    });
    res.status(201).json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function verifyOrder(req: Request, res: Response) {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.status(400).json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function userOrders(req: Request, res: Response) {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function listOrders(req: Request, res: Response) {
  try {
    const orders = await orderModel.find();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.status(200).json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: (error as Error).message });
  }
}
