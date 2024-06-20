import express from "express";
import {
  DeleteEmployee,
  EditExistedEmployee,
  createNewEmployee,
  getAllEmployee,
  getSingleEmployee,
  validateEmailNContact,
} from "../Controller/employeeController.js";

const router = express.Router();

router.get("/", getAllEmployee);
router.get("/:id", getSingleEmployee);
router.post("/", createNewEmployee);
router.put("/:id", EditExistedEmployee);
router.delete("/:id", DeleteEmployee);
router.post("/emailContact", validateEmailNContact);

export default router;
