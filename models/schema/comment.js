import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
    commentId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    text:{type:String,max:[500,'max len 500 chars'],require:[true,'comment is required']},
    answer:{type:String,max:[1000,'max len 1000 chars']},
    isAccepted:{type:Boolean,default:false},
    likeCount:{type:Number,default:0},
    movieId:{ref:'movies',type:mongoose.Types.ObjectId,require:false},
    userId:{ref:'users',type:mongoose.Types.ObjectId}
},{timestaps:true})

export const comments = mongoose.model('comments',CommentSchema)