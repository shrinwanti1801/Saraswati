const User=require('../Models/User');
const Category=require('../Models/Category');
const Course=require('../Models/Course');
const {uploadImageToCloudinary}=require('../Utils/uploadImageToCloudinary');
require('dotenv').config();

exports.createCourse=async(req,res)=>{
    try{
        //fetch data from req's body
        const {courseName,
               courseDescription,
               whatYouWillLearn,
               price,
               category
            }=req.body;

        //get thumbnail 
        const thumbnail=req.files.Imagethumbnail;

        //validation on data
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail){
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }

        //check for instructor
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId);

        if(!instructorDetails)
        {
            return res.status(400).json({
                success:false,
                message:"instructor does not exist"
            })
        }

        //check does category exist 
        const categoryDetails=await Category.findById(category);
        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"category does not exist"
            })
        }

        //upload to cloudinary
        const thumbnailImage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);

        //create New user
        const newCourse=await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn,
            price,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
        });

        //add New user to user schema
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new:true}
        );

        //update the category schema (this was HomeWork)
        await Category.findByIdAndUpdate(
            {_id:categoryDetails._id},
            {
                $push:{
                    course:newCourse._id,
                }
            },
            {new:true}
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"SuccessFully created new Course",
            data:newCourse,
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error while creating new Course",
            error:error.message,
        })
    }
}

//show all courses
exports.showAllCourses=async (req,res)=>{
    try{
        const allCourses=await Course.find({});
        return res.status(200).json({
            success:true,
            message:"SuccessFully returned all courses",
            data:allCourses,
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"error while fetching all courses",
        })
    }
}



//get course details
exports.getCourseDetails=async(req,res)=>{
    try{
        //fetch data from req's body
        const {courseId}=req.body;

        //validate data
        if(!courseId)
        {
            return res.status(400).json({
                success:false,
                message:"All feilds are required"
            })
        }

        //get course details
        const courseDetails = await Course.findById(courseId)
                .populate({
                    path: "instructor",
                    populate:
                        {
                            path: "additionalDetails",
                        }
                })
                .populate("category")
                .populate("ratingAndReviews")
                .populate({
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                })
                .exec();


        // .populate([
        //     {
        //         path: "instructor",
        //         model: "User", 
        //     },
        //     {
        //         path: "courseContent",
        //         model: "Section",
        //         populate: { 
        //             path: "subSection", 
        //             model: "SubSection", 
        //         },
        //     },
        //     {
        //         path: "ratingAndReviews",
        //         model: "RatingAndReview", 
        //     },
        //     {
        //         path: "category",
        //         model: "Category", 
        //     },
        //     {
        //         path: "studentsEnrolled",
        //         model: "User", 
        //     }
        // ]).exec();

        //validated , does course exist or not
        if(!courseDetails)
        {
            return res.status(400).json({
                success:false,
                message:"course with this id does not exist",
            })
        }

        //return success response
        return res.status(200).json({
            success:true,
            message:"Course details fetched successFully",
            data:courseDetails,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:true,
            message:"Error while fetching course ",
        })
    }
}