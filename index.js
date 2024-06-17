import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/employeeRouter.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", adminRouter);
app.use("/employee", EmployeeRouter);

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, "jwt_secret_key", (error, decoded) => {
      if (error) {
        res.json({ Status: false, error: "Wrong Token" });
      }
      req.id = decoded.id;
      req.role = decoded.role;
      next();
    });
  } else {
    return res.json({ Status: false, error: "Not authanticated" });
  }
};

app.get("/verify", verifyUser, (req, res) => {
  return res.json({ Status: true, role: req.role, id: req.id });
});

const port = process.env.PORT || 8182;
app.listen(port, () => {
  console.log("Server is running");
});
