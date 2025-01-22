import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from 'razorpay'





//API to register User

const registerUser =async(req,res)=>{

    try {
            const {name,email,password} = req.body

        if(!name || !email || !password)
        {
            res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email))
        {
            res.json({success:false,message:'Enter a Valid Email'})
        }

        if(password.length<8)
        {
            res.json({success:false,message:'Enter a strong password'})
        }
            //check if user is already registered
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Email is already registered" });
        }

        //hashing password

        const salt  = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const userData ={
            name,
            email,
            password:hashPassword
        }

        const newUser = new userModel(userData)
        const user  = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
        res.json({success:true ,token})

    }
    catch(error)
    {
        res.json({success:false,message:error.message})
    }
}

//API for User Login

const loginUser = async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await userModel.findOne({email})
        // Validate input fields
        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if(!user)
        {
           return res.json({success:true,message:'User is not Found,Please Sign Up'})
        }

        // Validate password
        const isMatch = await bcrypt.compare(password,user.password)

        if(isMatch)
        {
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({success:false,message:"Invalid Credential"})
        }
    }
    catch(error)
    {
        res.json({success:false,message:error.message})
    }


}

//api to get profile
const getProfile = async(req,res)=>{
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})

    }
    catch(e)
    {
        res.json({success:false,message:e.message})
    }
}

//api to update user profile
const updateProfile = async(req,res)=>{
    try{
        const {userId,name,phone,address,dob,gender} = req.body
        const imageFile = req.file

        if(!name || !phone ||  !dob || !gender)
        {
         res.json({success:false,message:'Data Missing'})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),gender,dob,})
        await appointmentModel.updateMany(
            { userId },
            { 'userData.name': name, 'userData.phone': phone, 'userData.gender': gender ,'userData.dob':dob}
        );


        if(imageFile)
        {
            //upload to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageUrl})
            await appointmentModel.updateMany({userId},{'userData.image':imageUrl})
        }

        res.json({success:true,message:'profile updated'})

    }catch (e) {
        res.json({success:false,message:e.message})
    }
}


//API to book appointment

const bookAppointment = async(req,res)=>{
    try {
        const {docId,userId,slotDate,slotTime} = req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available)
        {
           return res.json({success:false,message:'Doctor Not Available'})
        }
        let slots_booked = docData.slots_booked

        //checking for slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime))
            {
               return res.json({success:false,message:'Slot Not Available'})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }else{
            slots_booked[slotDate] =[]
            slots_booked[slotDate].push(slotTime)
        }
        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now(),

        }

        const newAppointment =new appointmentModel(appointmentData)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        res.json({success:true,message:'Appointment Booked'})

}catch (e) {
            res.json({success:false,message:e.message})
    }
}

const listAppointment = async (req,res)=>{
    try {
        const {userId} = req.body
        const appointments = await appointmentModel
            .find({userId})

        res.json({success:true,appointments})
    }catch (e) {
        res.json({success:false,message:e.message})
    }
}

//Api to cancel appointment

const cancelAppointment = async(req,res) =>{

    try{

        const {userId,appointmentId}  =req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData.userId.toString()!==userId.toString())
        {
            return res.json({success:false,message:"Unauthorized action "})
        }

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

            //releasing doctors slot

        const {docId,slotDate,slotTime} = appointmentData

            const doctorData= await doctorModel.findById(docId)

        let slot_booked = doctorData.slots_booked
        slot_booked[slotDate]  = slot_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slot_booked})

       return res.json({success:true,message:"Appointment Cancelled"})

    }catch (e) {
        res.json({success:false,message:e.message})
    }
}

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})
//API to make Payment
const razorPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        // Fetch the appointment data
        const appointmentData = await appointmentModel.findById(appointmentId);

        // Check if the appointment exists and is not canceled
        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment cancelled or not found" });
        }

        // Create options for Razorpay payment
        const options = {
            amount: appointmentData.amount * 100, // Convert amount to paise if in INR
            currency: process.env.CURRENCY || "INR",
            receipt: appointmentId,
        };

        // Create Razorpay order
        const order = await razorpayInstance.orders.create(options);

        // Respond with the created order
        res.json({ success: true, order });

    } catch (e) {
        // Handle errors
        res.json({ success: false, message: e.message });
    }
};

//API to verify the payment
const verifyRazorPay = async (req,res)=>{

    try {
        const {razorpay_order_id} = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status==='paid')
        {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:'payment successful'})
        }
        else{
            res.json({success:false,message:'payment failed'})
        }

    }catch (e) {
        res.json({success:false,message:e.message})
    }
}


export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,razorPayment,verifyRazorPay}