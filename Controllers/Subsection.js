const SubSection=require('../Models/SubSection');
const Section=require('../Models/Section');
const {uploadImageToCloudinary}=require('../Utils/uploadImageToCloudinary')
require('dotenv').config();

exports.createSubSection=async(req,res)=>{
    try{
        //fetch data
        const {title,timeDuration,description,sectionId}=req.body;
        const video=req.files.videoFile;

        //validate the variables
        if(!title || !timeDuration || !description || !video || !sectionId)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }

        //upload to cloudinary
        const videoUploadToCloudinary=await uploadImageToCloudinary(video,process.env.FOLER_NAME);

        //create a entry in schema
        const subSectionDetails=await SubSection.create({
            title,
            timeDuration,
            description,
            videoUrl:videoUploadToCloudinary.secure_url
        })

        //add this subsection to section
        await Section.findByIdAndUpdate(
            sectionId,
            {
                $push:{
                    subSection:subSectionDetails._id,
                }
            },
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Created Subsection successfully"
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error while creating new Subsection"
        })
    }
}

//HW : update subsection
//HW : delete subsection