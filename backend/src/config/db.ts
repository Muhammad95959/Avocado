import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.DB_CONN_STRING || "").then(() => console.log("DB Connected"));
}
