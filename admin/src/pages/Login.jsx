import React, {useContext, useState} from 'react';
import {assets} from "../assets/assets.js";
import {AdminContext} from "../context/AdminContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";
import {DoctorContext} from "../context/DoctorContext.jsx";



const Login = ()=>{
    const [state,setState] = useState('Admin')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [showPassword,setShowPassword] = useState(false)

    const {setAToken,backendUrl} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)

    const onSubmitHandler = async (event) =>{

        event.preventDefault()
        try {
            if (state === 'Admin') {
                const {data} = await axios.post(backendUrl + '/api/admin/login',{email,password})
                if(data.success)
                {
                    localStorage.setItem('aToken',data.token)
                    setAToken(data.token);
                }
                else{
                    toast.error(data.message || "Login failed. Please try again.");
                }
            }else{
                const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password})
                if(data.success)
                {
                    localStorage.setItem('dToken',data.token)
                    setDToken(data.token);
                }
                else{
                    toast.error(data.message || "Login failed. Please try again.");
                }
            }

        }

            catch (error) {
                toast.error("An error occurred during the login process. Please try again later.");
            }

    }



    return (
        <form onSubmit={onSubmitHandler} className=" min-h-[80vh] flex items-center">
            <div
                className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg ">
                <p className="text-2xl font-semibold m-auto"><span className="text-primary"> {state}</span> Login</p>
                <div className="w-full">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email}
                           className="border border-[#DADADA] rounded w-full p-2 mt-1 " type="email" required/>
                </div>
                <div className="relative w-full">
                    <p>Password</p>
                    <input
                        className="border border-[#DADADA] rounded w-full p-2 mt-1 focus:ring-2 focus:ring-primary focus:outline-none transition-transform transform hover:scale-105"
                        type={showPassword ? "text" : "password"}
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                    <img
                        onClick={() => setShowPassword((prev) => !prev)}
                        src={showPassword ? assets.hide_icon : assets.show_icon}
                        alt={showPassword ? "Hide Password" : "Show Password"}
                        className="w-5 absolute right-3 top-11 transform -translate-y-1/2 cursor-pointer opacity-80 hover:opacity-100"
                    />
                </div>
                <button className="bg-primary text-white w-full py-2 rounded-md text-base">Login</button>

                {
                    state === 'Admin' ?
                        <p className="text-sm ">Doctor Login? <span onClick={() => setState('Doctor')}
                                                                    className="text-primary underline cursor-pointer"> Click Here</span>
                        </p>
                        : <p className="text-sm">Admin Login? <span onClick={() => setState('Admin')}
                                                                    className="text-primary underline cursor-pointer"> Click Here</span>
                        </p>
                }
            </div>
        </form>
    )
}

export default Login;