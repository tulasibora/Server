import mysql from "mysql";
import "dotenv/config";

function createConnection() {
  try {
    const con = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    con.connect(function (err) {
      if (err) {
        console.log("Error in connection:", err.message);
      } else {
        console.log("Connected successfully");
      }
    });

    return con;
  } catch (error) {
    console.log("An unexpected error occurred:", error.message);
    return null;
  }
}

export default createConnection;
