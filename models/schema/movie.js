import mongoose, { Types } from "mongoose";

const MovieSchema = mongoose.Schema({
    movieId:{type:Types.ObjectId,auto:true,unique:true},
    moviePersianTitle:{type:String},
    movieLatinTitle:{type:String},
    description:{type:String},
    summary:{type:String},
    movieCoverImageUrl:{type:String},
    duratoin:{type:Number},
    country:{type:String},
    minAge:{type:String},
    movieTrailerVideoUrl:{type:String},
    movieVideoUrl:{type:String},
    isFree:{type:Boolean},
    categoryId:{type:Types.ObjectId},
    genreId:{type:Types.ObjectId},
    directorId:{type:Types.ObjectId},
    actors:[{movieId:{type:Types.ObjectId}}]
},{timestaps:true})

export const movies = mongoose.model('movies',MovieSchema)