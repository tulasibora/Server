import express from "express";
import con from "../dataBase/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const router = express.Router();

//////////// Validate the User from the EMPLOYEE table /////

router.post("/employeelogin", (req, res) => {
  const sql = "Select * from employee Where email = ?";
  con.query(sql, [req.body.email], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      bcrypt.compare(req.body.password, result[0].password, (err, response) => {
        if (err) {
          res.json({ loginStatus: false, Error: "Query error" });
        } else if (response) {
          const token = jwt.sign(
            { role: "employee", email: email, id: result[0].id },
            "jwt_secret_key",
            { expiresIn: "1d" }
          );
          res.cookie("token", token);
          return res.json({ loginStatus: true, id: result[0].id });
        }
      });
    } else {
      return res.json({ loginStatus: false, Error: "wrong email or password" });
    }
  });
});

////// GET Employee List FROM THE EMPLOYEE TABLE //////////
/////// WITH INCLUDING SEARCH PAGE AND LIMIT ////////

router.get("/", (req, res) => {
  const name = req.query.name;
  const email = req.query.email;
  const job_title = req.query.job_title;
  const resultsPerPage = req.query.limit ? Number(req.query.limit) : 10;
  let sql = `SELECT * FROM employee
  WHERE name LIKE '%${name}%' AND email LIKE '%${email}%' AND job_title LIKE '%${job_title}%'`;
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
      sql = `SELECT * FROM employee
  WHERE name LIKE '%${name}%' AND email LIKE '%${email}%' AND job_title LIKE '%${job_title}%' LIMIT ${startingLimit},${resultsPerPage}`;
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

///////// Get Particular Employee From the Employee List ////

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const sql = "Select * from employee Where id= ? ";
  con.query(sql, [id], (err, result) => {
    if (err) {
      return res.json({ Staus: false, Error: "Qurey Error" });
    } else {
      return res.json({ Status: true, data: result });
    }
  });
});
///////////// Add new Employee  TO EMPLOYEE TABLE ////

router.post("/add_employee", (req, res) => {
  let sql =
    "INSERT INTO employee (`name`, `dept_id`, `password`, `email`, `job_title`, `contact`, `DOB`,`DOJ`) values (?)";
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
    ];
    con.query(sql, [values], (err, result) => {
      console.log(err);
      if (err) {
        res.json({ Status: false, Error: "Query Error" });
      } else {
        res.json({ Status: true, data: "Employee Added Succesfully" });
      }
    });
  });
});

//////////////Submit the Edited Data

router.put("/edit_employee/:id", (req, res) => {
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
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: "Employee Edited Succesfully" });
    }
  });
});

///////////DELETE PARTICULAR EMPLOYEE FROM THE TABLE

router.delete("/delete_employee/:id", (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM employee WHERE id=?`;
  con.query(sql, [id], (err, result) => {
    if (err) {
      res.json({ Status: false, Error: "Query Error" });
    } else {
      res.json({ Status: true, data: "Employee Deleted Succesfully" });
    }
  });
});

//// LOG OUT  EMPLOYEE  ///////////

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: true });
});

export { router as EmployeeRouter };
