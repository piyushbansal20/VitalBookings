import express from "express";
import {doctorList, loginDoctor} from "../controllers/doctorController.js";

const doctorRoutes = express.Router()

doctorRoutes.get('/list',doctorList)
doctorRoutes.post('/login',loginDoctor)
export default doctorRoutes



