import mongoose, { Types } from "mongoose";

const BoxSchema = mongoose.Schema({
    boxId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    boxPersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'comment is required']},
    boxLatinTitle:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    position:{type:Number,default:1},
    categoryId:{type:Types.ObjectId,ref:'categories'},
        movies:[
            {
                movieId:{ref:'movies',type:mongoose.Types.ObjectId,require:false}
            }
        ]
},{timestaps:true})

export const boxes = mongoose.model('boxes',BoxSchema)