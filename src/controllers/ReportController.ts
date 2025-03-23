import { Request, Response } from "express";
import ReportModel from "../models/ReportModel";

// Get all reports
export const getAllReports = async (req: Request, res: Response): Promise<Response> => {
    try {
        const reports = await ReportModel.find().sort({ reportedAt: -1 });
        return res.status(200).json({ reports });
    } catch (error) {
        console.error("Error fetching reports:", error);
        return res.status(500).json({ message: "Failed to fetch reports" });
    }
};

// Get a report by ID
export const getReportById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const report = await ReportModel.findById(id);
        if (!report) {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(200).json({ report });
    } catch (error) {
        console.error("Error fetching report details:", error);
        return res.status(500).json({ message: "Failed to fetch report details" });
    }
};


// Delete a report
export const deleteReport = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const deletedReport = await ReportModel.findByIdAndDelete(id);
        if (!deletedReport) {
            return res.status(404).json({ message: "Report not found" });
        }
        return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        return res.status(500).json({ message: "Failed to delete report" });
    }
};
