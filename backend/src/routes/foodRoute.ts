import express from "express";
import * as foodController from "../controllers/foodController";
import multer from "multer";

const foodRouter = express.Router();

const storage = multer.diskStorage({
  destination: "src/uploads",
  filename: (_req, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), foodController.addFood);
foodRouter.get("/list", foodController.listFood);
foodRouter.post("/remove", foodController.removeFood);

export default foodRouter;
