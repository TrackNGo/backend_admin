import { Request, Response } from "express";
import TimeTableModel from "../models/TimeTableModel";
import BusDataModel from "../models/BusDataModel";

// Create a new time table
export const createTimeTable = async (req: Request, res: Response) => {
  try {
    const { startLocation, endLocation, bus } = req.body;

    // Create Bus Data entries first
    const busData = await BusDataModel.insertMany(bus);

    // Create a new time table with bus data references
    const timeTable = new TimeTableModel({
      startLocation,
      endLocation,
      bus: busData.map((bus: any) => bus._id),
    });

    await timeTable.save();
    res.status(201).json(timeTable);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all time tables
export const getAllTimeTables = async (req: Request, res: Response) => {
  try {
    const timeTables = await TimeTableModel.find().populate("bus");
    res.status(200).json(timeTables);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get time tables by start and end location
export const getTimeTableByLocations = async (req: Request, res: Response): Promise<any> => {
  try {
    const { startLocation, endLocation } = req.query;

    const timeTables = await TimeTableModel.find({
      startLocation,
      endLocation,
    }).populate("bus");

    if (timeTables.length === 0) {
      return res.status(404).json({ message: "No time tables found for the specified locations" });
    }

    res.status(200).json(timeTables);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get time tables by bus route number and bus type
export const getTimeTableByRouteAndType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { busRouteNumber, busType } = req.query;

    const busData = await BusDataModel.find({
      busRouteNumber,
      busType,
    });

    if (busData.length === 0) {
      return res.status(404).json({ message: "No buses found with the specified route number and type" });
    }

    const timeTables = await TimeTableModel.find({
      bus: { $in: busData.map((bus) => bus._id) },
    }).populate("bus");

    res.status(200).json(timeTables);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific time table by ID
export const getTimeTableById = async (req: Request, res: Response): Promise<any> => {
  try {
    const timeTable = await TimeTableModel.findById(req.params.id).populate("bus");
    if (!timeTable) {
      return res.status(404).json({ message: "Time Table not found" });
    }
    res.status(200).json(timeTable);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a time table
export const updateTimeTable = async (req: Request, res: Response): Promise<any> => {
  try {
    const { startLocation, endLocation, bus } = req.body;

    const timeTable = await TimeTableModel.findById(req.params.id);
    if (!timeTable) {
      return res.status(404).json({ message: "Time Table not found" });
    }

    // Update Bus Data
    await BusDataModel.deleteMany({ _id: { $in: timeTable.bus } });
    const updatedBusData = await BusDataModel.insertMany(bus);

    // Update the Time Table
    timeTable.startLocation = startLocation;
    timeTable.endLocation = endLocation;
    timeTable.bus = updatedBusData.map((bus: any) => bus._id);

    await timeTable.save();
    res.status(200).json(timeTable);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a time table
export const deleteTimeTable = async (req: Request, res: Response): Promise<any> => {
  try {
    const timeTable = await TimeTableModel.findByIdAndDelete(req.params.id);
    if (!timeTable) {
      return res.status(404).json({ message: "Time Table not found" });
    }
    res.status(200).json({ message: "Time Table deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
