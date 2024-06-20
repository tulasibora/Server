import express from "express";
import jwt from "jsonwebtoken";
import createConnection from "../config/db.js";
import bcrypt from "bcrypt";

const con = createConnection();

//// Login validation

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(200).send({
        success: false,
        message: "Please fill Email and Password",
      });
    } else {
      const sql = "Select * from employee Where email = ?";

      con.query(sql, [req.body.email], (err, result) => {
        if (err) return res.json({ success: false, Error: "Query error" });
        if (result.length > 0) {
          const role = result[0].role;
          bcrypt.compare(
            req.body.password,
            result[0].password,
            (err, response) => {
              if (err) {
                res.json({ success: false, Error: "Query error" });
              } else if (response) {
                const token = jwt.sign(
                  { role: role, remail: email, id: result[0].id },
                  "jwt_secret_key",
                  { expiresIn: "1d" }
                );
                res.cookie("token", token);
                return res.json({
                  success: true,
                  id: result[0].id,
                  role: role,
                });
              }
            }
          );
        } else {
          return res.json({
            success: false,
            Error: "wrong email or password",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

//// logout From the System

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    // req.session.destroy();
    return res.json({ success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
