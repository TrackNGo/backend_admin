import { RequestHandler } from "express";
import FormSubmission from "../models/FormSubmission";


export const getAllSubmissions: RequestHandler = async (req, res) => {
  try {
    const submissions = await FormSubmission.find().sort({ submittedAt: -1 });
    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Error fetching submissions", error });
  }
};

export const getSubmissionById: RequestHandler = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
       res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json(submission);
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ message: "Error fetching submission", error });
  }
};

export const deleteSubmission: RequestHandler = async (req, res) => {
  try {
    const deleted = await FormSubmission.findByIdAndDelete(req.params.id);
    if (!deleted) {
       res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ message: "Error deleting submission", error });
  }
};

export const updateSubmission: RequestHandler = async (req, res) => {
  try {
    const { comment, status } = req.body;

    if (!comment || !status) {
       res.status(400).json({ message: "Comment and status are required" });
    }

    const submission = await FormSubmission.findByIdAndUpdate(
      req.params.id,
      { adminComment: comment, status },
      { new: true }
    );

    if (!submission) {
       res.status(404).json({ message: "Submission not found" });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ message: "Error updating submission", error });
  }
};