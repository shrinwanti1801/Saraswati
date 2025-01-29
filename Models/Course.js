const mongoose=require('mongoose');

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Section",
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"RatingAndReview",
    }],
    price:{
        type:String,
    },
    thumbnail:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    tag:{
        type:[String],
        required:true,
    },
    studentsEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        // type:String,
        ref:"User",
        required:true,
    }]
});

module.exports=mongoose.model("Course",courseSchema);