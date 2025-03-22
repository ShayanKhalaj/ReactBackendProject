import mongoose, { Types } from "mongoose";

const ActorMovieSchema = mongoose.Schema({
    actorId:{ref:'actors',type:Types.ObjectId},
    movieId:{ref:'movies',type:Types.ObjectId},
})

export const actorMovies = mongoose.model('actorMovies',ActorMovieSchema)