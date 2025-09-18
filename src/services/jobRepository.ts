import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface Job {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  original_files: string[];
  result_url: string | null;
}

export const createJob = async (filePaths: string[]): Promise<string> => {
  const jobId = uuidv4();
  const query = `
    INSERT INTO jobs (id, status, original_files)
    VALUES ($1, 'PENDING', $2)
  `;
  await pool.query(query, [jobId, filePaths]);
  return jobId;
};

export const getJob = async (jobId: string): Promise<Job | null> => {
  const query = 'SELECT * FROM jobs WHERE id = $1';
  const result = await pool.query(query, [jobId]);
  if (result.rows.length === 0) {
    return null;
  }
  
  const jobData = result.rows[0];
  return {
    id: jobData.id,
    status: jobData.status,
    original_files: jobData.original_files,
    result_url: jobData.result_url,
  };
};

export const updateJobStatus = async (jobId: string, status: Job['status']) => {
    const query = 'UPDATE jobs SET status = $1 WHERE id = $2';
    await pool.query(query, [status, jobId]);
};

export const completeJob = async (jobId: string, resultUrl: string) => {
    const query = 'UPDATE jobs SET status = $1, result_url = $2 WHERE id = $3';
    await pool.query(query, ['COMPLETED', resultUrl, jobId]);
};