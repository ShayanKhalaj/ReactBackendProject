import mongoose, { Types } from "mongoose";

const BoxMovieSchema = mongoose.Schema({
    boxId:{ref:'boxes',type:Types.ObjectId},
    movieId:{ref:'movies',type:Types.ObjectId},
})

export const boxMovies = mongoose.model('boxMovies',BoxMovieSchema)