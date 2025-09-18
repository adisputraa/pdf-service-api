import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import cloudinary from '../config/cloudinary';
import { getJob, updateJobStatus, completeJob } from './jobRepository';

export const mergePdfService = async (jobId: string): Promise<void> => {
  const job = await getJob(jobId);

  if (!job) {
    console.error(`[${jobId}] Job not found for processing.`);
    return;
  }

  try {
    console.log(`[${jobId}] Starting PDF merge process...`);
    await updateJobStatus(jobId, 'PROCESSING');

    const mergedPdf = await PDFDocument.create();

    for (const file of job.original_files) {
      const pdfBytes = await fs.readFile(file);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    const base64String = Buffer.from(mergedPdfBytes).toString('base64');
    const dataUri = `data:application/pdf;base64,${base64String}`;
    
    console.log(`[${jobId}] Uploading to Cloudinary...`);
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'raw',
      public_id: jobId,
      folder: 'pdf-merger',
    });

    await completeJob(jobId, uploadResult.secure_url);
    console.log(`[${jobId}] Upload COMPLETED. URL: ${uploadResult.secure_url}`);
    
    for (const file of job.original_files) {
        await fs.unlink(file);
    }

  } catch (error) {
    console.error(`[${jobId}] Error processing job:`, error);
    await updateJobStatus(jobId, 'FAILED');
  }
};