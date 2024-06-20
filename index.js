import express from "express";
import cors from "cors";
import adminRouter from "./Routes/AdminRoute.js";
import EmployeeRouter from "./Routes/employeeRouter.js";
import AuthRouter from "./Routes/AuthRouter.js";
import cookieParser from "cookie-parser";
import "dotenv/config";
import jwt from "jsonwebtoken";

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

app.use("/api/employee", EmployeeRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", AuthRouter);

const port = process.env.PORT || 8182;

///////////////// Verify the logged in or not ////////////

function verify(req, res, next) {
  try {
    const token = req.cookies.token;
    if (token) {
      jwt.verify(token, "jwt_secret_key", (error, decoded) => {
        if (error) {
          res.send({ success: false, error: "Wrong Token" });
        } else {
          req.id = decoded.id;
          req.role = decoded.role;
          next();
        }
      });
    } else {
      return res.send({ success: false, error: "Not authanticated" });
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
}

app.get("/verify", verify, (req, res) => {
  return res.json({ success: true, role: req.role, id: req.id });
});

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
