const User=require('../Models/User');
const mailSender = require('../Utils/mailSender');
const bcrypt=require('bcrypt');

//reset password token generate
exports.resetPasswordToken=async (req,res)=>{
    try{
        //fetching data from req body
        const {email}=req.body;

        //check user of this email
        const user=await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({
                success:false,
                message:"User is not registered",
            })
        }

        //generatign token
        const token=crypto.randomUUID();

        //update user by adding token and expires time
        const updateDetails=await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires:Date.now()+5*60*1000,
                                        },
                                        {new:true}
        );

        //create URL
        const url=`http://localhost:3000/update-password/${token}`;

        //sending mail containing url
        await mailSender(email,
                        "ResetPassword Link",
                         `Reset Password Link : ${url}`
                    );

        return res.status(200).json({
            success:true,
            message:"Mail send SuccessFully",
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error while sending reset link mail"
        })
    }
}


//reset password
exports.resetPassword=async (req,res)=>{
    try{
        //fetch data from req's body
        const {token,password,confirmPassword}=req.body;

        //password and confimPassword should be same
        if(password!=confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Passward and confirmPassword is not same",
            })
        }

        //get user details from DB
        const userDetails=await User.findOne({token:token});

        //user Details should not be null
        if(!userDetails)
        {
            return res.status(400).json({
                success:false,
                message:"Invalid token",
            })
        }

        //token time check
        if(userDetails.resetPasswordExpires<Date.now())
        {
            return res.status(400).json({
                success:false,
                message:"Token is expired, regenerate your token"
            })
        }

        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        //password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successFull"
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error while reseting password"
        })
    }
}