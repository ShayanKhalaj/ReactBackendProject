import mongoose from "mongoose";

const PeopleSchema = mongoose.Schema({
    personId:{type:mongoose.Types.ObjectId,auto:true,require:true,unique:true},
    firstname:{type:String,max:[50,'max len 50 chars'],require:[true,'firstname is required']},
    lastname:{type:String,max:[50,'max len 50 chars'],require:[true,'lastname is required']},
    profileImageUrl:{type:String,max:[2000,'max len 2000 chars']},
    bio:{
        birthDate:{type:String,max:[8,'max len 8 chars']},
        gender:{type:Boolean,default:false},
        nationality:{type:String,max:[100,'max len 100 chars'],default:'unkown'},
        summary:{type:String,max:[1000,'max len 1000 chars']},
    },
    movies:[
        {movieId:{ref:'movies',type:mongoose.Types.ObjectId}}
    ],
    series:[
        {serieId:{ref:'series',type:mongoose.Types.ObjectId}}
    ],
    spouse:{
        firstname:{type:String,max:[50,'max len 50 chars'],require:[true,'firstname is required']},
        lastname:{type:String,max:[50,'max len 50 chars'],require:[true,'lastname is required']},
    },
    awards:[
        {
            awardPersianName:{type:String,max:[100,'max len 100 chars']},
            awardLatinName:{type:String,max:[100,'max len 100 chars']},
            year:{type:String,max:[4,'max len 4 chars']},
            description:{type:String,max:[500,'max len 500 chars']},
        }
    ],
    jobs:[
        {jobId:{ref:'jobs',type:mongoose.Types.ObjectId}}
    ]
},{timestaps:true})

export const people = mongoose.model('people',PeopleSchema)