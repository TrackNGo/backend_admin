import { Request, Response } from "express";
import Report from "../models/ReportModel";

export const getAllReports = async (req: Request, res: Response) :Promise<any>=>{
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json({ reports });
      } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Failed to fetch reports' });
      }
}

export const getReportById = async (req: Request, res: Response) :Promise<any>=>{
    const { id } = req.params;
  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(200).json({ report });
  } catch (error) {
    console.error('Error fetching report details:', error);
    res.status(500).json({ message: 'Failed to fetch report details' });
  }
}