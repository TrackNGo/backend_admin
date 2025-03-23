import express from 'express';
import { getAllReports, getReportById,deleteReport,addCommentToReport} from '../controllers/ReportController';

const router = express.Router();

// Route to get all reports
router.get('/view', getAllReports);

// Route to get a specific report by ID
router.get('/view/:id', getReportById);

router.delete('/delete/:id', deleteReport);

router.put('/comment/:id', addCommentToReport);

export default router;