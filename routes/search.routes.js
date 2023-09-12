import { Router } from 'express';
import searchController from '../controllers/search.controller.js';

const router = Router();

router.route('/').get(searchController.search);

export default router;
