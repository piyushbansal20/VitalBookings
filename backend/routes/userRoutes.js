import express from "express";
import {
 bookAppointment, cancelAppointment,
 getProfile,
 listAppointment,
 loginUser,
 registerUser,
 updateProfile,
 razorPayment, verifyRazorPay
} from "../controllers/userController.js";
import authUser from "../middlewars/authUser.js";
import upload from "../middlewars/multer.js";

 const userRoutes = express.Router()

userRoutes.post('/register',registerUser)
userRoutes.post('/login',loginUser)
userRoutes.get('/get-profile',authUser,getProfile)
userRoutes.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRoutes.post('/book-appointment',authUser,bookAppointment)
userRoutes.get('/appointments',authUser,listAppointment)
userRoutes.post('/cancel-appointment',authUser,cancelAppointment)
userRoutes.post('/payment-razorpay',authUser,razorPayment)
userRoutes.post('/verify-razorpay',authUser,verifyRazorPay)


export default userRoutes