import express from 'express';
import { getAllReports, getReportById,deleteReport,addComment} from '../controllers/ReportController';

const router = express.Router();

// Route to get all reports
router.get('/reports', getAllReports);

// Route to get a specific report by ID
router.get('/reports/:id', getReportById);

router.delete('/reports/:id', deleteReport);

router.put("/reports/:id/comment", addComment);

export default router;