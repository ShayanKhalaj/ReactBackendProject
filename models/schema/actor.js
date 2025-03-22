import mongoose, { Types } from "mongoose";

const ActorSchema = mongoose.Schema({
    actorId:{type:Types.ObjectId,unique:true,auto:true},
    firstname:String,
    lastname:String,
    gender:Boolean,
    nation:String,
    actorImageUrl:String
},{timestamps:true})
export const actors = mongoose.model('actors',ActorSchema)