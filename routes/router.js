import express from 'express';
import categoryRouter from './pannel/categoryRouter.js';
import authRouter from './authRouter.js';
import boxRouter from './pannel/boxRouter.js';
import commentRouter from './pannel/commentRouter.js';
import genreRouter from './pannel/genreRouter.js';
import movieRouter from './pannel/movieRouter.js';
import sliderRouter from './pannel/sliderRouter.js';
import { authenticate } from '../guard/passport.js';
import { isAdmin } from '../guard/isAdmin.js';
import actorRouter from './pannel/actorRouter.js';
import directorRouter from './pannel/director.js';
import actorMovieRouter from './pannel/actorMovieRouter.js';
import boxMovieRouter from './pannel/boxMovieRouter.js';
import sliderMovieRouter from './pannel/sliderMovieRouter.js';
import { authorizeRoles } from '../guard/role.js';
import landingRouter from './landingRouter.js';

const router = express.Router();

// روت اصلی
router.get('/', (req, res) => {
    return res.json('main');
});

// روت‌های احراز هویت
router.use('/auth', authRouter);

// ایمن‌سازی تمام روترهای پنل با احراز هویت
// router.use('/pannel/*', );

// روت‌های پنل که فقط مدیران می‌توانند به آن‌ها دسترسی پیدا کنند
router.use('/pannel/categories', authenticate,authorizeRoles(['admin']), categoryRouter);
router.use('/pannel/boxes', authenticate,authorizeRoles(['admin']), boxRouter);
router.use('/pannel/comments', authenticate,authorizeRoles(['admin']), commentRouter);
router.use('/pannel/genres', authenticate,authorizeRoles(['admin']), genreRouter);
router.use('/pannel/movies', authenticate,authorizeRoles(['admin']), movieRouter);
router.use('/pannel/sliders', authenticate,authorizeRoles(['admin']), sliderRouter);
router.use('/pannel/actors', authenticate,authorizeRoles(['admin']), actorRouter);
router.use('/pannel/directors', authenticate,authorizeRoles(['admin']), directorRouter);
router.use('/pannel/actorMovies', authenticate,authorizeRoles(['admin']), actorMovieRouter);
router.use('/pannel/boxMovies', authenticate,authorizeRoles(['admin']), boxMovieRouter);
router.use('/pannel/sliderMovies', authenticate,authorizeRoles(['admin']), sliderMovieRouter);

// روت‌های عمومی سایت
router.use('/site', landingRouter);

export default router;
