import { Request, Response } from "express";
import userModel from "../models/userModel";

export async function addToCart(req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) throw new Error("User not found");
    const cartData = await user.cartData;
    if (!cartData[req.body.itemId]) cartData[req.body.itemId] = 1;
    else cartData[req.body.itemId] += 1;
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function removeFromCart(req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) throw new Error("User not found");
    const cartData = await user.cartData;
    if (cartData[req.body.itemId] > 0) cartData[req.body.itemId] -= 1;
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.status(200).json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: (error as Error).message });
  }
}

export async function getCart(req: Request, res: Response) {
  try {
    const user = await userModel.findById(req.body.userId);
    if (!user) throw new Error("User not found");
    const cartData = await user.cartData;
    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
}

export async function updateCartData(req: Request, res: Response) {
  try {
    const user = await userModel.findByIdAndUpdate(req.body.userId, { cartData: req.body.cartData }, { new: true });
    if (!user) throw new Error("User not found");
    res.status(200).json({ success: true, message: "Cart data was updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: (error as Error).message });
  }
}
