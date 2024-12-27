import mongoose from "mongoose";

const SeasonSchema = mongoose.Schema({
    seasonId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    seasonPersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'category is required']},
    seasonLatinTitle:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    summary:{type:String,max:[1000,'max len 1000 chars']},
    serieId:{ref:'series',type:mongoose.Types.ObjectId,require:[true,'serieId is required']}
},{timestaps:true})

export const seasons = mongoose.model('seasons',SeasonSchema)