import express from 'express';
import { getAllReports, getReportById} from '../controllers/ReportController';

const router = express.Router();

// Route to get all reports
router.get('/view', getAllReports);

// Route to get a specific report by ID
router.get('/view/:id', getReportById);

export default router;