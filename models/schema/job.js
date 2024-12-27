import mongoose from "mongoose";

const JobSchema = mongoose.Schema({
    jobId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    jobPersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'category is required']},
    jobLatinTitle:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    jobCoverImageUrl:{type:String,max:[2000,'max len 2000 chars']},
},{timestaps:true})

export const jobs = mongoose.model('jobs',JobSchema)