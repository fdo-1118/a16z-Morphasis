import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { fusionRouter } from './routes/fusion.js';
import { stylesRouter } from './routes/styles.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: '50mb' }));

app.use('/api/fuse', fusionRouter);
app.use('/api/styles', stylesRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n  ◆ Morphasis backend running at http://localhost:${PORT}\n`);
});
