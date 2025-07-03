import { Request, Response } from "express";
import userModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

function createToken(id: number) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
  return jwt.sign({ id }, process.env.JWT_SECRET);
}

export async function registerUser(req: Request, res: Response) {
  const { name, password, email } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "User already exists" });
    const newUser = new userModel({ name, email, password });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: (error as Error).message });
  }
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User doesn't exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid password" });
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: (error as Error).message });
  }
}
