import mongoose from "mongoose";

const SerieSchema = mongoose.Schema({
    serieId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    seriePersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'category is required']},
    serieLatinTitle:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    summary:{type:String,max:[1000,'max len 1000 chars']},
    country:{type:String,max:[100,'max len 100 chars']},
    minAge:{type:Number,require:[true,'min age is required'],default:12},
    serieCoverImageUrl:{type:String,max:[2000,'max len 2000 chars']},
    serieTrailerVideoUrl:{type:String,max:[2000,'max len 2000 chars']},
    categoryId:{ref:'categories',type:mongoose.Types.ObjectId,require:[true,'categoryId is required']},
    genreId:{ref:'genres',type:mongoose.Types.ObjectId,require:[true,'genreId is required']},
    people:[
        {
            personId:{ref:'people',type:mongoose.Types.ObjectId},
            jobId:{ref:'jobs',type:mongoose.Types.ObjectId}
        }
    ]
},{timestaps:true})

export const series = mongoose.model('series',SerieSchema)