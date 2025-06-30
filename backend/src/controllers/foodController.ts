import { Request, Response } from "express";
import foodModel from "../models/foodModel";
import fs from "fs";

export async function addFood(req: Request, res: Response) {
  let image_filename = `${req.file?.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export async function listFood(req: Request, res: Response) {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}

export async function removeFood(req: Request, res: Response) {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`src/uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
}
