import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.token as string;
  if (!token) return res.status(401).json({ success: false, message: "Not authorized login again" });
  try {
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing");
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = (token_decode as any).id;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: (error as Error).message });
  }
}
