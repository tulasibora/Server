import express from "express";
import bcrypt from "bcrypt";
import createConnection from "../config/db.js";

const router = express.Router();
const con = createConnection();

////// GET Employee List FROM THE EMPLOYEE TABLE //////////
/////// WITH INCLUDING SEARCH PAGE AND LIMIT ////////

export const getAllEmployee = async (req, res) => {
  try {
    const resultsPerPage = req.query.limit ? Number(req.query.limit) : 10;
    const name = req.query.name ? req.query.name : "";
    const email = req.query.email ? req.query.email : "";
    const job_title = req.query.job_title ? req.query.job_title : "";
    let sql = `SELECT * FROM employee
  WHERE name LIKE '%${name}%' AND email LIKE '%${email}%' AND job_title LIKE '%${job_title}%'`;
    con.query(sql, (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: err,
        });
      } else {
        const numOfResults = result.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        //Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;
        //Get the relevant number of POSTS for this starting page
        sql = `SELECT * FROM employee
  WHERE name LIKE '%${name}%' AND email LIKE '%${email}%' AND job_title LIKE '%${job_title}%' LIMIT ${startingLimit},${resultsPerPage}`;
        con.query(sql, (err, result) => {
          if (err) {
            res.status(200).send({
              success: false,
              message: err,
            });
          } else {
            res.status(200).send({
              success: true,
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
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

///////// Get Particular Employee From the Employee List ////

export const getSingleEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "Select * from employee Where id= ? ";
    con.query(sql, [id], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        res.status(200).send({
          success: true,
          data: result,
          message: "Read Employee successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

///////////// Add new Employee  TO EMPLOYEE TABLE ////

export const validateEmailNContact = async (req, res) => {
  try {
    let sql1 =
      "SELECT COUNT(*) as count FROM employee WHERE email = ? OR contact = ?";
    con.query(sql1, [req.body.email, req.body.contact], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        const count = result[0].count;
        res.status(200).send({
          success: true,
          data: count,
          message: "validate contact and email;",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export const createNewEmployee = async (req, res) => {
  try {
    let sql =
      "INSERT INTO employee (`name`, `dept_id`, `password`, `email`, `job_title`, `contact`, `DOB`,`DOJ`,`role`) values (?)";
    bcrypt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.json({ Status: false, Error: "Query Error" });
      const values = [
        req.body.name,
        req.body.dept_id,
        hash,
        req.body.email,
        req.body.job_title,
        req.body.contact,
        req.body.DOB,
        req.body.DOJ,
        req.body.role,
      ];
      con.query(sql, [values], (err, result) => {
        if (err) {
          res.status(200).send({
            success: false,
            message: "Query Error",
          });
        } else {
          res.status(200).send({
            success: true,
            message: "Department Added Succesfully",
          });
        }
      });
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

//////////////Submit the Edited Data
export const EditExistedEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `UPDATE employee SET name=?,dept_id=?,email=?,job_title=?,
  contact=?,DOB=?,DOJ=? where id=? `;
    const values = [
      req.body.name,
      req.body.dept_id,
      req.body.email,
      req.body.job_title,
      req.body.contact,
      req.body.DOB,
      req.body.DOJ,
    ];
    con.query(sql, [...values, id], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Employee Added Succesfully",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

///////////DELETE PARTICULAR EMPLOYEE FROM THE TABLE

export const DeleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM employee WHERE id=?`;
    con.query(sql, [id], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Employee Deleted Successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

export { router as EmployeeRouter };
