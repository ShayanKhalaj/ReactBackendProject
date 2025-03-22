import mongoose from "mongoose"

const CategorySchema = mongoose.Schema({
    categoryId:{type:mongoose.Types.ObjectId,auto:true,unique:true},
    categoryPersianName:{type:String,max:[100,'max len 100 chars'],require:[true,'category is required']},
    categoryLatinName:{type:String,max:[100,'max len 100 chars']},
    description:{type:String,max:[500,'max len 500 chars']},
    summary:{type:String,max:[1000,'max len 1000 chars']},
    categoryImageUrl:{type:String,max:[2000,'max len 2000 chars'],require:[true,'category image is required']},
},{timestaps:true})

export const categories = mongoose.model('categories',CategorySchema)