import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../context/AppContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {assets} from "../assets/assets.js";

const Login = () => {

    const {backendUrl,token,setToken}  = useContext(AppContext)
    const navigate = useNavigate()

    const [state, setState] = useState('Sign Up')
    const [showPassword,setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const[password, setPassword] = useState('')
    const [name, setName] = useState('')

    const onSubmitHandlebar = async(event)=>{
        event.preventDefault()

        try{
            if(state === 'Sign Up')
            {
                const {data} = await axios.post(backendUrl+'/api/user/register',{name,email,password})
                if(data.success)
                {
                    localStorage.setItem('token',data.token)
                    setToken(data.token)
                }else{
                    toast.error(data.message)
                }
            }
            else{
                const {data} = await axios.post(backendUrl+'/api/user/login',{email,password})
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setToken(data.token);

                }else{
                    toast.error(data.message)
                }
            }

        }
        catch(error){
            toast.error(error.message)
        }
    }
    useEffect(()=>{
        if(token)
        {
            navigate('/')
        }
    },[token])
    return (
        <div>
            <form onSubmit={onSubmitHandlebar} className="min-h-[80vh] flex items-center ">
                <div className="flex flex-col gap-3 m-auto items-start p-8 sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                    <p className="text-2xl font-semibold">{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                    <p>Please {state === 'Sign Up' ? "Sign Up" : "Login"} to book appointment</p>
                    {
                        state === 'Sign Up' && <div className="w-full">
                            <p>Full Name</p>
                            <input className="border border-zinc-300 rounded w-full p-2 mt-1 hover:scale-105" type="text"
                                   onChange={(e) => setName(e.target.value)} value={name} required/>
                        </div>
                    }

                    <div className="w-full">
                        <p>Email</p>
                        <input className="border border-zinc-300 rounded w-full p-2 mt-1 hover:scale-105" type="email" onChange={(e) => setEmail(e.target.value)} value={email} required/>
                    </div>
                    <div className="w-full">
                        <p>Password</p>
                        <div className="relative">
                            <input
                                className="border border-zinc-300 rounded w-full p-2 mt-1 hover:scale-105"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required
                            />
                            <img
                                onClick={() => setShowPassword(prev => !prev)}
                                src={showPassword ? assets.hide_icon : assets.show_icon}
                                alt=''
                                className="w-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            />
                        </div>

                    </div>
                    <button type="submit"
                            className="bg-primary text-white w-full py-2 rounded-md text-base mt-2"> {state === 'Sign Up' ? "Create Account" : "Login"}</button>
                    {state === 'Login' ? (
                        <p>Already have an account? <span onClick={() => setState('Sign Up')}
                                                          className="text-primary underline cursor-pointer">Sign Up here</span>
                        </p>
                    ) : (
                        <p>Don't have an account? <span onClick={() => setState('Login')}
                                                        className="text-primary underline cursor-pointer">Login here</span>
                        </p>
                    )}

                </div>


            </form>

        </div>
    );
};

export default Login;