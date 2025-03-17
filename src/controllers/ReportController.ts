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

