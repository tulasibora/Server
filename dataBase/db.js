import mysql from "mysql";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "Hrms",
});

con.connect(function (err) {
  if (err) {
    console.log("Error in onnection");
  } else {
    console.log("Conneted successfully");
  }
});

export default con;
