import mongoose from "mongoose";

const MovieSchema = mongoose.Schema({
    movieId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    moviePersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'category is required']},
    movieLatinTitle:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    summary:{type:String,max:[1000,'max len 1000 chars']},
    movieCoverImageUrl:{type:String,max:[2000,'max len 2000 chars']},
    duratoin:{type:String,require:[true,'duration is required'],max:[10,'max len 10 chars']},
    country:{type:String,max:[100,'max len 100 chars']},
    minAge:{type:Number,require:[true,'min age is required'],default:12},
    movieTrailerVideoUrl:{type:String,max:[2000,'max len 2000 chars']},
    movieVideoUrl:{type:String,max:[2000,'max len 2000 chars']},
    isFree:{type:Boolean,default:false},
    categoryId:{ref:'categories',type:mongoose.Types.ObjectId,require:[true,'categoryId is required']},
    genreId:{ref:'genres',type:mongoose.Types.ObjectId,require:[true,'genreId is required']},
    people:[
        {
            personId:{ref:'people',type:mongoose.Types.ObjectId},
            jobId:{ref:'jobs',type:mongoose.Types.ObjectId}
        }
    ]
},{timestaps:true})

export const movies = mongoose.model('movies',MovieSchema)