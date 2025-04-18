import { AboutImage } from "./models/AboutImageSchema.js";

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
// 獲取當前檔案的路徑
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV !== "production") {
  // 動態解析 .env 的絕對路徑
  const envPath = path.resolve(__dirname, "../.env");
  console.log("Loading .env from:", envPath);

  // 檢查 .env 檔案是否存在
  if (!fs.existsSync(envPath)) {
    throw new Error(`.env file not found at:${envPath}`);
  }

  // 加載環境變數
  const result = dotenv.config({ path: envPath });
  if (result.error) {
    throw new Error(`Failed to load .env: ${result.error.message}`);
  }
}

const DBURL = process.env.DB_URL;
if (!DBURL) {
  throw new Error("DB_URL is not defined in .env");
}

const connectToDB = async () => {
  try {
    await mongoose.connect(DBURL);
    console.log("connection successful");
  } catch (err) {
    console.error(err);
  }
};

connectToDB();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const addAboutImage = async () => {
  try {
    const images = [
      {
        public_id: "Pai/views/about/about_putqkq",
        imageURL:
          "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1744950175/Pai/views/about/about_putqkq",
        displayName: "about",
        offsetY: 0,
      },
      {
        public_id: "Pai/views/about/moto_berr54",
        imageURL:
          "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1744526927/Pai/views/about/moto_berr54",
        displayName: "moto",
        offsetY: 0,
      },
      {
        public_id: "Pai/views/about/pai_ed2g0k",
        imageURL:
          "https://res.cloudinary.com/dk1yh5mdu/image/upload/f_auto,q_auto,w_1440/v1744526927/Pai/views/about/pai_ed2g0k",
        displayName: "pai",
        offsetY: 0,
      },
    ];

    await AboutImage.insertMany(images);
  } catch (error) {
    console.error(error);
  }
};

addAboutImage();
