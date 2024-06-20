import express from "express";
import {
  DeleteExistedRecord,
  EditExistedDepartment,
  addNewDepartment,
  getAllDepartments,
  getParticularRecord,
  validateDepartment,
} from "../Controller/adminController.js";

const router = express.Router();

router.get("/", getAllDepartments);
router.get("/:id", getParticularRecord);
router.post("/", addNewDepartment);
router.put("/:id", EditExistedDepartment);
router.delete("/:id", DeleteExistedRecord);
router.post("/validateDept", validateDepartment);

export default router;
