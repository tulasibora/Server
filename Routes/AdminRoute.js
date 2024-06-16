import express from "express";
import con from "../dataBase/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/adminlogin", (req, res) => {
  console.log(req.body);
  const sql = "Select * from admin Where email = ? and password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const token = jwt.sign(
        { role: "admin", email: email, id: result[0].id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie("token", token);
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

/// get category list

router.get("/departments", (req, res) => {
  const resultsPerPage = req.query.limit ? Number(req.query.limit) : 10;
  const dept_name = req.query.dept_name;
  let sql = `SELECT * FROM departments WHERE dept_name LIKE '%${dept_name}%' `;
  con.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      const numOfResults = result.length;
      const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
      let page = req.query.page ? Number(req.query.page) : 1;
      //Determine the SQL LIMIT starting number
      const startingLimit = (page - 1) * resultsPerPage;
      //Get the relevant number of POSTS for this starting page
      sql = `SELECT * FROM departments WHERE dept_name LIKE '%${dept_name}%' LIMIT ${startingLimit},${resultsPerPage}`;
      con.query(sql, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.json({
            Status: true,
            data: result,
            limit: resultsPerPage,
            total: numOfResults,
            numberOfPages: numberOfPages,
            pageNumber: page,
          });
        }
      });
    }
  });
});

//// Add new Department

router.post("/add_department", (req, res) => {
  const sql = "insert departments (`dept_name`) values (?)";
  con.query(sql, [req.body.name], (err, result) => {
    if (err) {
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: "Department Added Succesfully" });
    }
  });
});

//// get Deparments List

router.get("/departmentsDropdown", (req, res) => {
  const sql = "SELECT * from departments";
  con.query(sql, (err, result) => {
    if (err) {
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: result });
    }
  });
});
//// submit edited List

router.put("/editdepartment/:id", (req, res) => {
  const id = req.params.id;
  const value = [req.body.name];
  const sql = `UPDATE departments SET dept_name=? where id=? `;
  con.query(sql, [value, id], (err, result) => {
    if (err) {
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: "Deparmet Edited Successfully" });
    }
  });
});

//// get particulat List

router.get("/departments/:id", (req, res) => {
  const id = req.params.id;
  const sql = `Select * from departments Where id=?`;
  con.query(sql, [id], (err, result) => {
    if (err) {
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: result });
    }
  });
});

//// delete particulat department

router.delete("/delete_departments/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM departments Where id=?`;
  con.query(sql, [id], (err, result) => {
    if (err) {
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: "department Deleted Succesfully" });
    }
  });
});

//// logout From the System

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});
export { router as adminRouter };
