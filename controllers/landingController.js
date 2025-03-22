import mongoose, { Types } from "mongoose";
import { boxes } from "../models/schema/box.js";
import { movies } from "../models/schema/movie.js";
import { sliders } from "../models/schema/slider.js";
import { categories } from "../models/schema/category.js";
import { genres } from "../models/schema/genre.js";
import { directors } from "../models/schema/director.js";
import { actorMovies } from "../models/schema/actorMovie.js";
import { actors } from "../models/schema/actor.js";

class LandingController {
  async getSlider(req, res) {
    const slider = await sliders.findOne();

    const movs = slider.movies;

    let sliderMovies = [];

    for (let mov of movs) {
      const mo = await movies.findOne({ movieId: mov.movieId });
      sliderMovies.push(mo);
    }

    return res.status(200).json(sliderMovies); // Return the enriched slider
  }

  async getSliderByCategoryId(req, res) {
    const slider = await sliders.findOne({ categoryId: req.params.categoryId });
    const movs = slider.movies;

    let sliderMovies = [];

    for (let mov of movs) {
      const mo = await movies.findOne({ movieId: mov.movieId });
      sliderMovies.push(mo);
    }

    return res.status(200).json(sliderMovies); // Return the enriched slider
  }

  async getBoxWithMovies(req, res) {
    try {
      const boxWithMovies = await boxes.aggregate([
        // مرحله اول: باز کردن آرایه movies برای بررسی هر فیلم به صورت جداگانه
        {
          $unwind: "$movies"
        },
        // مرحله دوم: استفاده از $lookup برای اتصال به مجموعه movies
        {
          $lookup: {
            from: "movies", // نام مجموعه فیلم‌ها
            localField: "movies.movieId", // فیلد در مدل boxes که حاوی movieId هاست
            foreignField: "movieId", // فیلد مرتبط در مدل movies
            as: "moviesDetails" // نام فیلد خروجی حاوی داده‌های فیلم‌ها
          }
        },
        // مرحله سوم: گروه‌بندی دوباره نتایج به صورت آرایه (در صورتی که چندین فیلم وجود داشته باشد)
        {
          $group: {
            _id: "$_id", // شناسه رکورد box
            boxId: { $first: "$boxId" },
            boxPersianTitle: { $first: "$boxPersianTitle" },
            boxLatinTitle: { $first: "$boxLatinTitle" },
            description: { $first: "$description" },
            position: { $first: "$position" },
            categoryId: { $first: "$categoryId" },
            // افزودن فیلم‌ها به صورت آرایه
            moviesDetails: {
              $push: {
                movieId: { $arrayElemAt: ["$moviesDetails.movieId", 0] },
                moviePersianTitle: { $arrayElemAt: ["$moviesDetails.moviePersianTitle", 0] },
                movieLatinTitle: { $arrayElemAt: ["$moviesDetails.movieLatinTitle", 0] },
                description: { $arrayElemAt: ["$moviesDetails.description", 0] },
                summary: { $arrayElemAt: ["$moviesDetails.summary", 0] },
                movieCoverImageUrl: { $arrayElemAt: ["$moviesDetails.movieCoverImageUrl", 0] },
                duration: { $arrayElemAt: ["$moviesDetails.duratoin", 0] },
                country: { $arrayElemAt: ["$moviesDetails.country", 0] },
                minAge: { $arrayElemAt: ["$moviesDetails.minAge", 0] },
                movieTrailerVideoUrl: { $arrayElemAt: ["$moviesDetails.movieTrailerVideoUrl", 0] },
                movieVideoUrl: { $arrayElemAt: ["$moviesDetails.movieVideoUrl", 0] },
                isFree: { $arrayElemAt: ["$moviesDetails.isFree", 0] },
                genreId: { $arrayElemAt: ["$moviesDetails.genreId", 0] },
                categoryId: { $arrayElemAt: ["$moviesDetails.categoryId", 0] },
                directorId: { $arrayElemAt: ["$moviesDetails.directorId", 0] },
              }
            }
          }
        }
      ]);
  
  
      // ارسال پاسخ به کلاینت
      return res.status(200).json(boxWithMovies ?? []);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "خطا در دریافت اطلاعات", data: [] });
    }
  }
  
  
  

  async getBoxWithMoviesByCategoryId(req, res) {
    try {
      const categoryId = new Types.ObjectId(req.params.categoryId); // تبدیل رشته به ObjectId
      const boxWithMovies = await boxes.aggregate([
      {
        $match:{categoryId:categoryId}
      },        // مرحله اول: باز کردن آرایه movies برای بررسی هر فیلم به صورت جداگانه
        {
          $unwind: "$movies"
        },
        // مرحله دوم: استفاده از $lookup برای اتصال به مجموعه movies
        {
          $lookup: {
            from: "movies", // نام مجموعه فیلم‌ها
            localField: "movies.movieId", // فیلد در مدل boxes که حاوی movieId هاست
            foreignField: "movieId", // فیلد مرتبط در مدل movies
            as: "moviesDetails" // نام فیلد خروجی حاوی داده‌های فیلم‌ها
          }
        },
        // مرحله سوم: گروه‌بندی دوباره نتایج به صورت آرایه (در صورتی که چندین فیلم وجود داشته باشد)
        {
          $group: {
            _id: "$_id", // شناسه رکورد box
            boxId: { $first: "$boxId" },
            boxPersianTitle: { $first: "$boxPersianTitle" },
            boxLatinTitle: { $first: "$boxLatinTitle" },
            description: { $first: "$description" },
            position: { $first: "$position" },
            categoryId: { $first: "$categoryId" },
            // افزودن فیلم‌ها به صورت آرایه
            moviesDetails: {
              $push: {
                movieId: { $arrayElemAt: ["$moviesDetails.movieId", 0] },
                moviePersianTitle: { $arrayElemAt: ["$moviesDetails.moviePersianTitle", 0] },
                movieLatinTitle: { $arrayElemAt: ["$moviesDetails.movieLatinTitle", 0] },
                description: { $arrayElemAt: ["$moviesDetails.description", 0] },
                summary: { $arrayElemAt: ["$moviesDetails.summary", 0] },
                movieCoverImageUrl: { $arrayElemAt: ["$moviesDetails.movieCoverImageUrl", 0] },
                duration: { $arrayElemAt: ["$moviesDetails.duratoin", 0] },
                country: { $arrayElemAt: ["$moviesDetails.country", 0] },
                minAge: { $arrayElemAt: ["$moviesDetails.minAge", 0] },
                movieTrailerVideoUrl: { $arrayElemAt: ["$moviesDetails.movieTrailerVideoUrl", 0] },
                movieVideoUrl: { $arrayElemAt: ["$moviesDetails.movieVideoUrl", 0] },
                isFree: { $arrayElemAt: ["$moviesDetails.isFree", 0] },
                genreId: { $arrayElemAt: ["$moviesDetails.genreId", 0] },
                categoryId: { $arrayElemAt: ["$moviesDetails.categoryId", 0] },
                directorId: { $arrayElemAt: ["$moviesDetails.directorId", 0] },
              }
            }
          }
        }
      ]);

  
      if (boxWithMovies.length === 0) {
        return res.status(404).json({ error: "باکس یافت نشد" });
      }
  
      return res.status(200).json(boxWithMovies); // ارسال اولین نتیجه
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "خطا در دریافت اطلاعات" });
    }
  }

  async getCategories(req,res){
        const cats =await categories.find({})
        return res.status(200).json(cats)
  }

  async getMovieById(req,res){
    const movi = await movies.findOne({movieId:req.params.movieId})
    if(!movi) return res.status(404).json("movie not found")
    return res.status(200).json(movi);
  }

  async getGenreByMovieId(req,res){
    const genre = await genres.findOne({genreId:req.params.genreId})
    return res.status(200).json(genre)
  }

  async getDirectorByMovieId(req,res){
    const director = await directors.findOne({directorId:req.params.directorId})
    return res.status(200).json(director)
  }


  async  getActorMoviesByMovieId(req, res) {
    try {
      const movieId = req.params.movieId; // دریافت `movieId` از پارامترهای درخواست
  
      const actorMovie = await actorMovies.aggregate([
        {
          $match: { movieId: new mongoose.Types.ObjectId(movieId) }, // فیلتر بر اساس `movieId`
        },
        {
          $lookup: {
            from: "actors", // نام کالکشن بازیگران
            localField: "actorId", // فیلد مشترک در `actorMovies`
            foreignField: "actorId", // فیلد مرتبط در `actors`
            as: "actorDetails", // ذخیره اطلاعات بازیگر در یک آرایه جدید
          },
        },
      ]);

  
      res.status(200).json(actorMovie);
    } catch (error) {
      console.error("Error in getActorMoviesByMovieId:", error);
      res.status(500).json({ message: "خطایی رخ داده است" });
    }
  }
  
  
  
  
  
}

export default LandingController;
