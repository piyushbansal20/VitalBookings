import express from "express";
import {
    addDoctor,
    adminAppointment, adminDashboard,
    allDoctors,
    appointmentCancel,
    loginAdmin
} from "../controllers/adminController.js";
import upload from "../middlewars/multer.js";
import authAdmin from "../middlewars/authAdmin.js";
import {changeAvailability} from "../controllers/doctorController.js";

const adminRouter = express.Router()


adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.get('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,adminAppointment)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/admin-dashboard',authAdmin,adminDashboard)



export default adminRouter