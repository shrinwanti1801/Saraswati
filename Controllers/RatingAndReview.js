const RatingAndReview=require('../Models/RatingAndReview');
const Course=require('../Models/Course');
const mongoose=require('mongoose');
const { ObjectId } = require('mongodb');

// exports.createRatingAndReview=async (req,res)=>{
//     const { courseId, rating, review } = req.body;

//     // Validate data
//     if (!courseId || !rating || !review) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required"
//         });
//     }

//     // Convert userId and courseId to ObjectId
//     let userId=req.user.id;
//     console.log(userId);
//     try {
//         userId = mongoose.Types.ObjectId(userId);
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid user ID"
//         });
//     }

//     let courseObjectId;
//     try {
//         courseObjectId = mongoose.Types.ObjectId(courseId);
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             message: "Invalid course ID"
//         });
//     }

//     try {
//         // Check if the course exists
//         const courseDetails = await Course.findById(courseObjectId);
//         if (!courseDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Course not found"
//             });
//         }

//         // Check if user is enrolled in the course
//         const isEnrolled = courseDetails.studentsEnrolled.some(enrolledUser => enrolledUser.equals(userId));
//         if (!isEnrolled) {
//             return res.status(403).json({
//                 success: false,
//                 message: "User is not enrolled in this course"
//             });
//         }

//         // User is enrolled in the course
//         return res.status(200).json({
//             success: true,
//             message: "User is enrolled in this course"
//         });
//     } catch (error) {
//         console.error("Error:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }

// create rating
exports.createRatingAndReview=async (req,res)=>{
    try{
        //get data
        const {courseId,rating,review}=req.body;
        // courseId=new mongoose.Types.ObjectId(courseId);

        let userId=req.user.id;
        userId=new ObjectId(userId);
    
        //validate data
        if(!courseId || !userId || !rating || !review)
        {
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }

        //check if user is enrolled or not
        const courseDetails = await Course.findOne({
            _id: courseId,
        });

        if(!courseDetails.studentsEnrolled.includes(userId))
        {
            return res.status(400).json({
                success:false,
                message:"user did't buy this course and can't review",
            })
        }

        //check if user already exist or not
        const alreadyReviewed=await RatingAndReview.findOne({
            user:userId,
            course:courseId
        });
        
        if(alreadyReviewed){
            return res.status(403).json({
                success:false,
                message:"course is already reviewed by user",
            })
        }

        //create Rating and Review 
        const ratingAndReview=await RatingAndReview.create({
            rating,
            review,
            course:courseId,
            user:userId
        })

        //update course with this rating and review
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    ratingAndReviews:ratingAndReview._id,
                }
            },
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Review created successFully",
            data:ratingAndReview
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error while creating Rating and Review",
        })
    }
}



// getAverage Rating
exports.getAverageRating=async (req,res)=>{
    try{
        //get courseId
        const {courseId}=req.body;

        //calculate avg rating
   
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])

        // console.log(result);
        //return rating
        if(result.length>0)
        {
            return res.status(200).json({
                success:true,
                data:result[0].averageRating,
            })
        }

        //if no rating/review exist
        return res.status(200).json({
            success:true,
            message:"Average rating is 0, no ratings given till now",
            data:0
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while calculating average rating"
        })
    }
}

  
//get All rating and reviews
exports.getAllRating=async (req,res)=>{
    try{

        const allReviews=await RatingAndReview.find({})
        .sort({rating:"desc"})
        .populate(
            {
                path:"user",
                select:"firstName lastName email image",
            }
        )
        .populate({
            path:"course",
            select:"courseName"
        }).
        exec();

        //console.log(allReviews)
        //return response
        return res.status(200).json({
            success:true,
            message:"All reviwes fetched successFully",
            data:allReviews
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while fetching All reviwes",
        })
    }
}