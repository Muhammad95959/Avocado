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
    res.status(200).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error" });
  }
}

export async function listFood(req: Request, res: Response) {
  try {
    const foods = await foodModel.find({});
    res.status(200).json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Error" });
  }
}

export async function removeFood(req: Request, res: Response) {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`src/uploads/${food.image}`, (err) => {
      if (err) console.error("Failed to delete image: ", err);
    });
    await foodModel.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Error" });
  }
}
