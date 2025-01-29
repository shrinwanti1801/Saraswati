const User=require('../Models/User');
const Profile=require('../Models/Profile');
const { ObjectId } = require('mongodb');

//update profile
exports.updateProfile=async(req,res)=>{
    try{
        //fetch data
        const{dateOfBirth="",contactNumber="",gender,about}=req.body;
        const userId=req.user.id;

        //validation
        if(!gender || !about || !userId)
        {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        //get profile id
        const userDetails=await User.findById(userId);
        const profileId=userDetails.additionalDetails;

        //update in profile
        const updatedProfile=await Profile.findByIdAndUpdate(
            profileId,
            {
                dateOfBirth,
                contactNumber,
                gender,
                about
            },
            {new:true}
        )

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            updatedProfile,
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while updating profile"
        })
    }
}

//delete account
exports.deleteAccount=async(req,res)=>{
    try{
        //fetch data
        const userId=req.user.id;
        const userDetails=await User.findById(userId);

        //validation
        if(!userDetails)
        {
            return res.status(400).json({
                success:false,
                message:"Userid is not valid"
            })
        }

        //detele entry from Profile
        const profileId=userDetails.additionalDetails;
        await Profile.findByIdAndDelete(profileId);

        //delete entry from User 
        await User.findByIdAndDelete(userId);
       
        //return response
        return res.status(200).json({
            success:true,
            message:"Account deleted successfully",
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while deleting Account"
        })
    }
}


//get all user Details
exports.getAllUserDetails=async(req,res)=>{
    try{
        //get user id
        const userId=req.user.id;
        
        const userDetails=await User.find({
            _id:userId
        }).populate("additionalDetails").exec();
        
        console.log(userDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            data:userDetails,
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while fetching user details"
        })
    }
}