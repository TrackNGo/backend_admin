import { Request, Response } from "express";
import ReportModel from "../models/ReportModel";

export const getAllReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const reports = await ReportModel.find().sort({ reportedAt: -1 });
        res.status(200).json({ reports });
        return;
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch reports" });
        return;
    }
};

export const getReportById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const report = await ReportModel.findById(id);
        if (!report) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json({ report });
    } catch (error) {
        console.error("Error fetching report details:", error);
        res.status(500).json({ message: "Failed to fetch report details" });
    }
};


export const deleteReport = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deletedReport = await ReportModel.findByIdAndDelete(id);
        if (!deletedReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json({ message: "Report deleted successfully" });
        return;
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Failed to delete report" });
        return;
    }
};


export const addCommentToReport = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { comment } = req.body;
    
    try {
        const updatedReport = await ReportModel.findByIdAndUpdate(
            id,
            { adminComment: comment },
            { new: true }
        );
        
        if (!updatedReport) {
            res.status(404).json({ message: "Report not found" });
            return;
        }
        res.status(200).json({ report: updatedReport });
        return;
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Failed to add comment" });
        return;
    }
};