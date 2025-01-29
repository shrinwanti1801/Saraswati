const { instance } = require('../Config/razorpay');
const User = require('../Models/User');
const Course = require('../Models/Course');
const mailSender = require('../Utils/mailSender');
const mongoose=require('mongoose');

exports.capturePayment = async (req, res) => {
    try {
        // Get CourseID and UserID
        const { courseID } = req.body;
        const { userID } = req.user.id;

        // Validation
        if (!courseID || !userID) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Course details and validation
        const courseDetails = await Course.findById(courseID);

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: "Course details are not present"
            });
        }

        // Check if user already paid for the same course
        userID = new mongoose.Types.ObjectId(userID);
        if (courseDetails.studentsEnrolled.includes(userID)) {
            return res.status(400).json({
                success: false,
                message: "User has already bought this course, no need to buy it again"
            });
        }

        // Payment options
        const amount = courseDetails.price;
        const currency = "INR";
        const receipt = generateReceipt();

        const options = {
            amount: amount * 100,
            currency,
            receipt,
            notes: {
                courseID,
                userID,
            }
        };

        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // Return response
        return res.status(200).json({
            success: true,
            courseName: courseDetails.courseName,
            courseDescription: courseDetails.courseDescription,
            thumbnail: courseDetails.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: "Could not initiate the order"
        });
    }
}

// Function to generate a random receipt
function generateReceipt() {
    return Math.random().toString(36).substring(7); // Adjust length of receipt as needed
}


exports.verifySignature = async (req, res) => {
    try {
        const webHookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const signature = req.headers["x-razorpay-signature"];
        const payload = req.body;

        // Verify signature
        const shasum = crypto.createHmac("sha256", webHookSecret);
        shasum.update(JSON.stringify(payload));
        const digest = shasum.digest("hex");

        if (signature !== digest) {
            return res.status(403).json({
                success: false,
                message: "Invalid signature"
            });
        }

        // Signature is verified
        console.log("Payment is authorized");

        // Extract relevant information from payload
        const { courseID, userID } = req.body.payload.payment.entity.notes;

        // Update course with enrolled student
        const courseDetails = await Course.findByIdAndUpdate(
            courseID, 
            {
                $push: { studentsEnrolled: userID }
            }, 
            { new: true }
        );

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Update user with enrolled course
        const userDetails = await User.findByIdAndUpdate(
            userID, 
            {
                $push: { courses: courseID }
            }, 
            { new: true }
        );

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Send email to user
        await mailSender(
            userDetails.email, 
            "Congrats from Sarswati", 
            "Congrats, you are onboarded to a new course"
        );

        return res.status(200).json({
            success: true,
            message: "Signature verified and course added"
        });
    } 
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
