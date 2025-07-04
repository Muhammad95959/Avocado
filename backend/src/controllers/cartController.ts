import { Request, Response } from "express";
import userModel from "../models/userModel";

export async function addToCart(req: Request, res: Response) {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) cartData[req.body.itemId] = 1;
    else cartData[req.body.itemId] += 1;
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: (error as Error).message });
  }
}

export async function removeFromCart(req: Request, res: Response) {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = await userData.cartData;
    if (cartData[req.body.itemId] > 0) cartData[req.body.itemId] -= 1;
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: (error as Error).message });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const userData = await userModel.findById(req.body.userId);
    const cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: (error as Error).message });
  }
}
