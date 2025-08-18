import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import foodRouter from "./routes/foodRoute";
import userRouter from "./routes/userRoute";
import cartRouter from "./routes/cartRoute";
import orderRouter from "./routes/orderRoute";

const app = express();
const port = process.env.PORT || 4000;

connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/v1/food", foodRouter);
app.use("/images", express.static("src/uploads"));
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (_req: Request, res: Response) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

export default app;
