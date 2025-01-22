import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../context/AppContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MyAppointments = () => {

    const {backendUrl,token,getDoctorsData} = useContext(AppContext)
    const [appointments,setAppointments] = useState([])
    const navigate = useNavigate()
    const months =["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    const slotDateFormat = (slotDate)=>{
        const dateArray = slotDate.split('_')
        return dateArray[0]+" "+months[Number(dateArray[1])-1] + " " +dateArray[2]
    }

    const getUserAppointment = async ()=>{
        try{
            const {data} =  await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})

            if(data.success)
            {
                setAppointments(data.appointments.reverse())
            }

        }catch (e) {
            toast.error(e.message)
        }

    }

    const cancelAppointment  = async (appointmentId)=>{
        try{
            const {data} = await axios.post(backendUrl + '/api/user/cancel-appointment',{appointmentId},{headers:{token}})

            if(data.success)
            {
                toast.success(data.message)
                getUserAppointment()
                getDoctorsData( )
            }
            else{
                toast.error(data.message)
            }
        }catch (e) {
            toast.error(e.message)
        }
    }

    const initPay = (order)=>{
        const options = {
            key:import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency:order.currency,
            name:"Appointment Payment",
            description:"Appointment Payment",
            order_id:order.id,
            receipt:order.receipt,
            handler:async (response)=>{
                console.log(response)

                try {
                    const {data} = await axios.post(backendUrl+'/api/user/verify-razorpay',response,{headers:{token}})
                    if(data.success)
                    {
                        getUserAppointment()
                        navigate('/my-appointments')
                    }

                }catch(e){
                    toast.error(e.message)
                }
            }

        }
        const rzp = new window.Razorpay(options )
        rzp.open()


    }

    const appointmentRazorpay = async (appointmentId)=>{

        try{
            const {data} = await axios.post(backendUrl+"/api/user/payment-razorpay", {appointmentId},{headers:{token}})

            if(data.success)
            {
              initPay(data.order)
            }else {
                toast.error("Failed to create Razorpay order.");
            }

        }catch (e) {
            toast.error(e.message)
        }


    }

    useEffect(() => {
        if(token)
        {
            getUserAppointment()
        }
    }, [token]);


    return (
        <div >
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My Appointments</p>
            <div>
                {appointments.map((item,index)=>(
                    <div className="grid grid-col-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b " key={index}>
                        <div>
                           <img className="w-32 bg-indigo-50" src={item.docData.image} alt=""/>
                        </div>
                        <div className="flex-1 text-sm text-zinc-700 ">
                            <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                            <p>{item.speciality}</p>
                            <p className="text-zinc-700 font-medium mt-1">Address:</p>
                            <p className="text-sm">{item.docData.address.line1}</p>
                            <p  className="text-sm">{item.docData.address.line2}</p>
                            <p className="mt-1 mb-1 text-neutral-800 text-sm">Date & Time:<span className="text-sm text-zinc-700"> {slotDateFormat(item.slotDate)} |  {item.slotTime}</span></p>
                        </div>
                        <div> </div>
                        <div className="flex flex-col gap-2 justify-end">
                            {!item.cancelled && item.payment && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">paid</button>}
                            {!item.cancelled && !item.payment && <button onClick={() => appointmentRazorpay(item._id)}
                                className="text-sm bg-primary text-white text-center sm:min-w-48 py-2 border rounded hover:scale-105 transition-all duration-300">Pay
                                here</button>}
                            {!item.cancelled && <button onClick={() => cancelAppointment(item._id)} className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:scale-105 hover:bg-red-600
                             hover:text-white transition-all duration-300">Cancel appointment</button>}
                            {item.cancelled && <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">Appointment Cancelled</button>}
                        </div>


                    </div>
                ))}

            </div>

        </div>
    );
};

export default MyAppointments;