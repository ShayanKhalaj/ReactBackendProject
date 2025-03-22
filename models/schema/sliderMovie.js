import mongoose, { Types } from "mongoose";

const SliderMovieSchema=mongoose.Schema({
    sliderId:{ref:'sliders',type:Types.ObjectId},
    movieId:{ref:'movies',type:Types.ObjectId},
})

export const sliderMovies = mongoose.model("sliderMovies",SliderMovieSchema)