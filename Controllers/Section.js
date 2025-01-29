const Course=require('../Models/Course');
const Section=require('../Models/Section');
const mongoose=require('mongoose');

exports.createSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName,courseId}=req.body;

        //all fields should present
        if(!sectionName || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //creating a new section
        const newSection=await Section.create({sectionName});

        //adding sectionId to course
        const updatedCourse=await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"SuccessFully created a new section",
            data:updatedCourse
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"Error while creating a new section"
        })
    }
}



//update section
exports.updateSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionName,sectionId}=req.body;

        //all fields should present
        if(!sectionName || !sectionId)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //updating in section schema
        const updatedSection=await Section.findByIdAndUpdate(
            sectionId,
            {sectionName},
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Section updated SuccessFully"
        })
    }
    catch(error)
    {
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"Error while updating a section"
        })
    }
}


//deleting a section
exports.deleteSection=async(req,res)=>{
    try{
        //fetch data
        const {sectionId,courseId}=req.body;

        console.log(sectionId, courseId);

        //is sectionId present
        if(!sectionId || !courseId)
        {
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }

    
        //delete from section
        await Section.findByIdAndDelete(sectionId);

       
        //delete this section from course's too -> todo
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { 
                $pull: { courseContent: new mongoose.Types.ObjectId(sectionId) } 
            },
            { new: true }
        );
        
        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        //return response
        return res.status(200).json({
            success:"true",
            message:"Section deleted successFully"
        })

    }
    catch(error){
        console.log(error)
        return res.status(400).json({
            success:false,
            message:"Unable to delete a section"
        })
    }
}

