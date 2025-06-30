import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import foodRouter from "./routes/foodRoute";

const app = express();
const port = 4000;

connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/v1/food", foodRouter);
app.use("/images", express.static("src/uploads"));

app.get("/", (_req: Request, res: Response) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
