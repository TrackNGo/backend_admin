import express from "express";
import {
  createTimeTable,
  getAllTimeTables,
  getTimeTableById,
  updateTimeTable,
  deleteTimeTable,
  getTimeTableByLocations,
  getTimeTableByRouteAndType,
} from "../controllers/TimeTableController";

const router = express.Router();

// Time Table routes
router.post("/add", createTimeTable);
router.get("/view", getAllTimeTables);
router.get("/locations", getTimeTableByLocations); // New endpoint for filtering by locations
router.get("/route-type", getTimeTableByRouteAndType); // New endpoint for filtering by route and type
router.get("/:id", getTimeTableById);
router.put("/update/:id", updateTimeTable);
router.delete("/delete/:id", deleteTimeTable);

export default router;
