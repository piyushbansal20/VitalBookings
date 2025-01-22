import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;
connectDB()
connectCloudinary()

app.use(express.json());
app.use(cors());
app.use('/api/admin',adminRoutes) //3000/api/admin/add-doctor
app.use('/api/doctor',doctorRoutes)
app.use('/api/user',userRoutes)


//api endpoint
app.get('/', (req, res) => {
    res.send('API Working');
})
app.server = app.listen(PORT, () => {
  console.log(` server is running at http://localhost:${PORT}/`);
})