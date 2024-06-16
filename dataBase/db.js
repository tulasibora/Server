import mysql from "mysql";
import "dotenv/config";

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
con.connect(function (err) {
  if (err) {
    console.log("Error in onnection");
  } else {
    console.log("Conneted successfully");
  }
});

export default con;
