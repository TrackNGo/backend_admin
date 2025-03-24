import express from 'express';
import {
  getAllSubmissions,
  getSubmissionById,
  deleteSubmission
} from '../controllers/formSubmissionController';

const router = express.Router();

router.get('/', getAllSubmissions);
router.get('/:id', getSubmissionById);
router.delete('/:id', deleteSubmission);

export default router;