import mongoose, { Types } from "mongoose"

const DirectorSchema = mongoose.Schema({
    directorId:{type:Types.ObjectId,auto:true,unique:true},
    firstname:String,
    lastname:String,
    gender:Boolean,
    nation:String,
    directorImageUrl:String
},{timestamps:true})

export const directors = mongoose.model('directors',DirectorSchema)