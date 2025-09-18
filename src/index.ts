import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import jobRoutes from './api/jobs';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/jobs', jobRoutes);

app.listen(PORT, () => {
  console.log(`✅ TypeScript PDF Service running on http://localhost:${PORT}`);
});