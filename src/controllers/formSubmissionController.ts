import { Request, Response } from 'express';
import FormSubmission from '../models/FormSubmission';

export const getAllSubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const submissions = await FormSubmission.find().sort({ submittedAt: -1 });
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error });
    }
};

export const getSubmissionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const submission = await FormSubmission.findById(req.params.id);
        if (!submission) {
            res.status(404).json({ message: 'Submission not found' });
            return;
        }
        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submission', error });
    }
};

export const deleteSubmission = async (req: Request, res: Response): Promise<void> => {
    try {
        const deleted = await FormSubmission.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ message: 'Submission not found' });
            return;
        }
        res.json({ message: 'Submission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting submission', error });
    }
};