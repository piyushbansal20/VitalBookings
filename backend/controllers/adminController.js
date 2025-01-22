import validator from "validator";
import bcrypt from 'bcrypt'
import { v2 as cloudinary} from 'cloudinary'
import doctorModel from "../models/doctorModel.js";
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";


//API for adding doctor

const addDoctor = async(req,res) =>{
    try {
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body
        const imageFile = req.file

        //checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address)
        {
            return res.res.json({success:false,message:"Missing Detail"})
        }

        //validating email format
        if(!validator.isEmail(email))
        {
            return res.json({success:false,message:'Please enter a valid email'})
        }

        //validating strong password
        if(password.length<8)
        {
            return  res.json({success:false,message:' please enter a strong password'})
        }

            //hashing doctor password
        const salt   =  await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
        const imageUrl = imageUpload.secure_url

        const doctorData =
            {
                name,
                email,
                image:imageUrl,
                password:hashedPassword,
                speciality,
                degree,
                experience,
                about,
                fees,
                address:JSON.parse(address),
                date:Date.now()
            }
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({success:true,message:"doctor added"})

    }
    catch (e)
    {
        console.log(e)
        res.json({success:false,message:e.message})

    }
}

//API for Login admin

const loginAdmin = async(req,res) =>{
    try {
        const {email,password} = req.body
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
        {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }
        else{
            res.json({ success: false, message: "Invalid Login" });

        }

    }
    catch (e)
    {
        console.log(e)
        res.json({success:false,message:e.message})

    }
}
//api to get all doctor list

const allDoctors = async(req,res) =>{
        try {
                const doctors = await doctorModel.find({}).select('-password')
                res.json({success:true,doctors})
        }
        catch(error){
            console.log(error)
            res.json({success: false,message:error.message})
        }
}

//API to show appointment to the doctor

const adminAppointment = async(req,res)=>
{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    }catch(error){
        console.log(error)
        res.json({success: false,message:error.message})
    }

}

const appointmentCancel = async(req,res) =>{

    try{

        const {appointmentId}  =req.body

        const appointmentData = await appointmentModel.findById(appointmentId)



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


const adminDashboard = async(req,res)=>{
    try {
        const users = await userModel.find({})
        const doctors = await doctorModel.find({})
        const appointments =  await appointmentModel.find({})

        const dashData = {
            doctors : doctors.length,
            users : users.length,
            appointments:appointments.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})

    }catch (e) {
        res.json({success:false,message:e.message})
    }
}

export {addDoctor,loginAdmin,allDoctors,adminAppointment,appointmentCancel,adminDashboard}