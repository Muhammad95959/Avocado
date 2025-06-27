import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());

app.get("/", (_req: Request, res: Response) => {
  res.send("API Working");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
