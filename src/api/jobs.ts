import { Router } from 'express';
import multer from 'multer';
import { createMergeJob, getJobStatus, downloadResult } from '../controllers/jobController';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const router = Router();

router.post('/merge', upload.array('files', 10), createMergeJob);
router.get('/:jobId/status', getJobStatus);
router.get('/:jobId/download', downloadResult);

export default router;