import express from 'express';
import categoryRouter from './pannel/categoryRouter.js';
import authRouter from './authRouter.js';
import boxRouter from './pannel/boxRouter.js';
import commentRouter from './pannel/commentRouter.js';
import episodeRouter from './pannel/episodeRouter.js';
import genreRouter from './pannel/genreRouter.js';
import jobRouter from './pannel/jobRouter.js';
import movieRouter from './pannel/movieRouter.js';
import peopleRouter from './pannel/peopleRouter.js';
import seasonRouter from './pannel/seasonRouter.js';
import serieRouter from './pannel/serieRouter.js';
import sliderRouter from './pannel/sliderRouter.js';
import { authenticate } from '../guard/passport.js'; // اضافه کردن middleware
import { isAdmin } from '../guard/isAdmin.js';


const router = express.Router();

// روت اصلی
router.get('/', (req, res) => {
    return res.json('main');
});

// روت های احراز هویت
router.use("/auth", authRouter);

// ایمن سازی تمام روترهای پنل با احراز هویت و نقش مدیر
router.use('/pannel/*', authenticate, isAdmin);

// روت های پنل که فقط مدیران می‌توانند به آن‌ها دسترسی پیدا کنند
router.use('/pannel/categories', categoryRouter);
router.use('/pannel/boxes', boxRouter);
router.use('/pannel/comments', commentRouter);
router.use('/pannel/episodes', episodeRouter);
router.use('/pannel/genres', genreRouter);
router.use('/pannel/jobs', jobRouter);
router.use('/pannel/movies', movieRouter);
router.use('/pannel/people', peopleRouter);
router.use('/pannel/seasons', seasonRouter);
router.use('/pannel/series', serieRouter);
router.use('/pannel/sliders', sliderRouter);

export default router;
