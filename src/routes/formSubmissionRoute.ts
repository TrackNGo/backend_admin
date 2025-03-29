import express from 'express';
import {
  getAllSubmissions,
  getSubmissionById,
  deleteSubmission,
  updateSubmission,
} from '../controllers/formSubmissionController';

const router = express.Router();

router.get('/forms', getAllSubmissions);
router.get('/contact-us/:id', getSubmissionById);
router.delete('/contact-us/:id', deleteSubmission);
router.put('/contact-us/:id', updateSubmission);

export default router;