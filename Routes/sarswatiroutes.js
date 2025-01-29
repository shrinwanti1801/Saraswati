const express=require('express');
const router=express.Router();


//controllers
const {signUp}=require('../Controllers/Authz');
const {sendOTP}=require('../Controllers/Authz');
const {login}=require('../Controllers/Authz');

//middlewares
const {authz}=require('../Middlewares/Authz');
const {isStudent}=require('../Middlewares/Authz');
const {isInstructor}=require('../Middlewares/Authz');
const {isAdmin}=require('../Middlewares/Authz');

//controllers
const {createCategory}=require('../Controllers/Category');
const {showAllCategory}=require('../Controllers/Category');
const {categoryPageDetails}=require('../Controllers/Category');

const {createCourse}=require('../Controllers/Course');
const {showAllCourses}=require('../Controllers/Course');
const {getCourseDetails}=require('../Controllers/Course');

const {updateProfile}=require('../Controllers/Profile');
const {deleteAccount}=require('../Controllers/Profile');
const {getAllUserDetails}=require('../Controllers/Profile');

const {createRatingAndReview}=require('../Controllers/RatingAndReview');
const {getAverageRating}=require('../Controllers/RatingAndReview');
const {getAllRating}=require('../Controllers/RatingAndReview');

const {createSection}=require('../Controllers/Section');
const {updateSection}=require('../Controllers/Section');
const {deleteSection}=require('../Controllers/Section');

const {createSubSection}=require('../Controllers/Subsection');
// const {updateSubSection}=require('../Controllers/Subsection');
// const {deleteSubSection}=require('../Controllers/Subsection');

const {resetPasswordToken}=require('../Controllers/ResetPassword');
const {resetPassword}=require('../Controllers/ResetPassword');

//Payment
const {capturePayment}=require('../Controllers/Razorpay');
const {verifySignature}=require('../Controllers/Razorpay');

/*------------------------------------------------Routes-----------------------------------*/

//auth
router.post('/signup',signUp);
router.post('/sendotp',sendOTP);
router.post('/login',login);

//category
router.post('/createcategory',createCategory);
router.get('/showallcategory',showAllCategory);
router.post('/categorypagedetails',categoryPageDetails);

//course
router.post('/createcourse',authz,isStudent,createCourse);
router.get('/showallcourses',showAllCourses);
router.post('/getcoursedetails',getCourseDetails);

//profiles
router.put('/updateprofile',authz,updateProfile);
router.delete('/deleteaccount',authz,deleteAccount);
router.get('/getalluserdetails',authz,getAllUserDetails);

//Rating and Review
router.post('/createRatingAndReview',authz,createRatingAndReview);
router.post('/getAverageRating',getAverageRating);
router.get('/getAllRating',getAllRating);


//section
router.post('/createSection',createSection);
router.put('/updateSection',updateSection);
router.post('/deleteSection',deleteSection);

//subsection
router.post('/createSubSection',createSubSection);

//reset password
router.post('/resetPasswordToken',resetPasswordToken);
router.post('/resetPassword',resetPassword);

//payment
router.post("/capturePayment",capturePayment);
router.get("/verifySignature",verifySignature);

module.exports=router;

