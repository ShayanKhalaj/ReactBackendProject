import mongoose, { Types } from "mongoose";

const SliderSchema = mongoose.Schema({
    sliderId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    sliderPersianTitle:{type:String,max:[100,'max len 100 chars'],require:[true,'comment is required']},
    sliderLatinTitle:{type:String,max:[100,'max len 100 chars']},
    saummary:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    categoryId:{type:Types.ObjectId,ref:'categories'},
    movies:[
        {
            movieId:{ref:'movies',type:mongoose.Types.ObjectId,require:false}
        }
    ]
},{timestaps:true})

export const sliders = mongoose.model('sliders',SliderSchema)