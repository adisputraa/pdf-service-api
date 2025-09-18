import { Request, Response } from 'express';
import { mergePdfService } from '../services/pdfService';
import { createJob, getJob } from '../services/jobRepository';

export const createMergeJob = async (req: Request, res: Response): Promise<void> => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    res.status(400).json({ error: 'No files uploaded.' });
    return;
  }

  try {
    const files = req.files as Express.Multer.File[];
    const filePaths = files.map(f => f.path);

    const jobId = await createJob(filePaths);

    res.status(202).json({
      message: 'Files uploaded. Processing started.',
      jobId: jobId,
    });

    mergePdfService(jobId);

  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job in the database.' });
  }
};

export const getJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const job = await getJob(jobId);

    if (!job) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    res.status(200).json({
      jobId: job.id,
      status: job.status,
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ error: 'Failed to fetch job status.' });
  }
};

export const downloadResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const job = await getJob(jobId);

    if (!job) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    if (job.status !== 'COMPLETED' || !job.result_url) {
      res.status(400).json({ error: 'Job is not yet completed or file path is missing.' });
      return;
    }

    res.redirect(job.result_url);
    
  } catch (error) {
    console.error('Error handling download request:', error);
    res.status(500).json({ error: 'Failed to handle download request.' });
  }
};