import express from "express";
import createConnection from "../config/db.js";

const router = express.Router();
const con = createConnection();

/// get category list

export const getAllDepartments = async (req, res) => {
  try {
    const resultsPerPage = req.query.limit ? Number(req.query.limit) : 10;
    const dept_name = req.query.dept_name ? req.query.dept_name : "";
    let sql = `SELECT * FROM departments WHERE dept_name LIKE '%${dept_name}%' `;
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
        sql = `SELECT * FROM departments WHERE dept_name LIKE '%${dept_name}%' LIMIT ${startingLimit},${resultsPerPage}`;
        con.query(sql, (err, result) => {
          if (err) {
            res.status(200).send({
              success: false,
              message: "Query Error",
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
///////get Particular Record
export const getParticularRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `Select * FROM departments Where id=?`;
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
          message: "Read Department successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
//// Add new Department
export const addNewDepartment = async (req, res) => {
  try {
    const sql = "insert departments (`dept_name`) values (?)";
    con.query(sql, [req.body.dept_name], (err, result) => {
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
  } catch (err) {
    res.status(500).send("Server Error");
  }
};
//// submit edited List
export const EditExistedDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    const value = [req.body.name];
    const sql = `UPDATE departments SET dept_name=? where id=? `;
    con.query(sql, [value, id], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Deparmet Edited Successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

//// delete particulat department
export const DeleteExistedRecord = async (req, res) => {
  try {
    const id = req.params.id;
    const sql = `DELETE FROM departments Where id=?`;
    con.query(sql, [id], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        res.status(200).send({
          success: true,
          message: "Deparmet Deleted Successfully",
        });
      }
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

////////////// verify department already existed

export const validateDepartment = async (req, res) => {
  try {
    let sql1 = "SELECT COUNT(*) as count FROM departments WHERE dept_name = ? ";
    con.query(sql1, [req.body.dept_name], (err, result) => {
      if (err) {
        res.status(200).send({
          success: false,
          message: "Query Error",
        });
      } else {
        const count = result[0].count;
        console.log(count);
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
export { router as adminRouter };
