import mysql from "mysql";
import "dotenv/config";

const mySqlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}:${process.env.MYSQLHOST}
:${process.env.MYSQLPORT}:${process.env.MYSQLDATABASE}`;

const con = mysql.createConnection(mySqlDB);
// {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// }

con.connect(function (err) {
  if (err) {
    console.log("Error in onnection");
  } else {
    console.log("Conneted successfully");
  }
});

export default con;
