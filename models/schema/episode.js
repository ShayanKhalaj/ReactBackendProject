import mongoose from "mongoose";

const EpisodeSchema = mongoose.Schema({
    episodeId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    episodePersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'category is required']},
    episodeLatinTitle:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    summary:{type:String,max:[1000,'max len 1000 chars']},
    duratoin:{type:String,require:[true,'duration is required'],max:[10,'max len 10 chars']},
    episodeCoverImageUrl:{type:String,max:[2000,'max len 2000 chars']},
    episodeVideoUrl:{type:String,max:[2000,'max len 2000 chars']},
    isFree:{type:Boolean,default:false},
    seasonId:{ref:'seasons',type:mongoose.Types.ObjectId,require:[true,'seasonId is required']}
},{timestaps:true})

export const episodes = mongoose.model('episodes',EpisodeSchema)