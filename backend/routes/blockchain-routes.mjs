import express from 'express';
import { protect } from '../middleware/authorization.mjs';
import { listBlock } from '../controllers/blockchain-controller.mjs';

const router = express.Router();

router.get('/', listBlock);

export default router;
