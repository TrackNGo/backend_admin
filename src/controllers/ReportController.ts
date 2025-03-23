// controllers/reportController.ts
import { RequestHandler } from "express";
import ReportModel from "../models/ReportModel";

export const getAllReports: RequestHandler = async (req, res) => {
  try {
    const reports = await ReportModel.find().sort({ reportedAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reports" });
  }
};

export const getReportById: RequestHandler = async (req, res) => {
  try {
    const report = await ReportModel.findById(req.params.id);
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error fetching report" });
  }
};

export const addComment: RequestHandler = async (req, res) => {
  try {
    const report = await ReportModel.findByIdAndUpdate(
      req.params.id,
      { adminComment: req.body.comment },
      { new: true }
    );
    if (!report) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
};

export const deleteReport: RequestHandler = async (req, res) => {
  try {
    const deletedReport = await ReportModel.findByIdAndDelete(req.params.id);
    if (!deletedReport) {
      res.status(404).json({ message: "Report not found" });
      return;
    }
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting report" });
  }
};