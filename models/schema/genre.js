import mongoose from "mongoose";

const GenreSchema = mongoose.Schema({
    genreId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    genrePersianName:{type:String,max:[100,'max len 100 chars'],require:[true,'genre is required']},
    genreLatinName:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    summary:{type:String,max:[1000,'max len 1000 chars']},
    genreCoverImageUrl:{type:String,max:[2000,'max len 2000 chars']},
},{timestaps:true})

export const genres = mongoose.model('genres',GenreSchema)