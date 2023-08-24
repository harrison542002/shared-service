import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import * as dotenv from "dotenv";
import cors from "cors";
import adminRouter from "./admin/admin.routes";
import categoryRouter from "./category/category.routes";
import userRouter from "./user/user.routes";
import postRouter from "./post/post.routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server Running on http://localhost:${PORT}/`);
});
