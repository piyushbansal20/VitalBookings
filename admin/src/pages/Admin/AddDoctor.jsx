import React, {useContext, useState} from 'react';
import {assets} from "../../assets/assets.js";
import {AdminContext} from "../../context/AdminContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";

const AddDoctor = () => {

    const [docImg,setDocImg] = useState(false)
    const [name,setName] = useState('')
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [experience,setExperience] = useState('1 year')
    const [fees,setFees] = useState('')
    const [about,setAbout] = useState('')
    const [speciality,setSpeciality] = useState('General physician')
    const [degree,setDegree] = useState('')
    const [address1,setAddress1] = useState('')
    const [address2,setAddress2] = useState('')
    const [showPassword,setShowPassword] = useState(false)

    const {aToken,backendUrl} = useContext(AdminContext)

    const onSubmitHandler = async(event)=>{
        event.preventDefault()

        try{
            if(!docImg)
            {
                return toast.error('Image Not Selected')
            }
            const formData = new FormData()
            formData.append('image',docImg)
            formData.append('name',name)
            formData.append('email',email)
            formData.append('password',password)
            formData.append('experience',experience)
            formData.append('fees',Number(fees))
            formData.append('about',about)
            formData.append('speciality',speciality)
            formData.append('degree',degree)
            formData.append('address',JSON.stringify({line1:address1,line2:address2}))

            //console log form data
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{aToken}})
                if(data.success)
                {
                    toast.success(data.message)
                    setDocImg(false)
                    setName('')
                    setEmail('')
                    setPassword('')
                    setExperience('1 year')
                    setFees('')
                    setAbout('')
                    setSpeciality('General physician')
                    setDegree('')
                    setAddress1('')
                    setAddress2('')
                }
                else{
                    toast.error(data.message)
                }
        }
        catch(error){
                toast.error(error.message)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Add Doctor</p>
            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                <div className="flex items-center gap-4 mb-8 text-gray-500">
                    <label htmlFor="doc-img">
                        <img className="w-16 bg-gray-100 rounded-full cursor-pointer" src={docImg?URL.createObjectURL(docImg):assets.upload_area} alt=""/>
                    </label>
                    <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id="doc-img" hidden/>
                    <p>Upload Doctor Picture</p>
                </div>
                <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                    <div className="w-full lg:flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <p>Doctor Name</p>
                            <input onChange={(e)=>setName(e.target.value)} value={name} className="border rounded px-3 py-2" type="text" placeholder="name" required/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Doctor Email</p>
                            <input onChange={(e)=>setEmail(e.target.value)} value={email}  className="border rounded px-3 py-2" type="email" placeholder="Email" required/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Doctor Password</p>
                            <div className="relative">
                                <input onChange={(e) => setPassword(e.target.value)} value={password}
                                       className="border rounded px-3 py-2 w-full pr-12"  type={showPassword ? "text" : "password"}
                                       placeholder="password" required/>
                                <img className="w-5 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(prev => !prev)}
                                     src={`${showPassword ? assets.hide_icon : assets.show_icon}`}/>
                            </div>

                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Experience</p>
                            <select onChange={(e) => setExperience(e.target.value)} value={experience}
                                    className="border rounded px-3 py-2">
                            <option value="1 year">1 year</option>
                                <option value="2 year">2 year</option>
                                <option value="3 year">3 year</option>
                                <option value="4 year">4 year</option>
                                <option value="5 year">5 year</option>
                                <option value="6 year">6 year</option>
                                <option value="7 year">7 year</option>
                                <option value="8 year">8 year</option>
                                <option value="9 year">9 year</option>
                                <option value="more than 9 year">more than 9 year</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Fees</p>
                            <input onChange={(e)=>setFees(e.target.value)} value={fees}  className="border rounded px-3 py-2" type="number" placeholder="Fees" min="20" required/>
                        </div>
                    </div>
                    <div className="w-full lg:flex-1 flex flex-col gap-4" >
                    <div className="flex flex-col gap-1">
                        <p>Speciality</p>
                        <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality}  className="border rounded px-3 py-2">
                            <option value="General physician">General physician</option>
                            <option value="Gynecologist">Gynecologist</option>
                            <option value="Dermatologist">Dermatologist</option>
                            <option value="Pediatricians">Pediatricians</option>
                            <option value="Neurologist">Neurologist</option>
                            <option value="Gastroenterologist">Gastroenterologist</option>
                        </select>
                    </div>
                        <div className="flex flex-col gap-1">
                            <p>Education</p>
                            <input onChange={(e)=>setDegree(e.target.value)} value={degree}  className="border rounded px-3 py-2" type="text" placeholder="education" required/>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p>Address</p>
                            <input onChange={(e)=>setAddress1(e.target.value)} value={address1}  className="border rounded px-3 py-2" type="text" placeholder="line1" required/>
                            <input onChange={(e)=>setAddress2(e.target.value)} value={address2}  className="border rounded px-3 py-2"  type="text" placeholder="line2" required/>
                        </div>
                    </div>

                </div>

                <div >
                    <p className="mt-4 mb-2">About</p>
                    <textarea onChange={(e)=>setAbout(e.target.value)} value={about}  className="w-full px-4 pt-2 border rounded" placeholder="Write about doctor" rows={5} required/>
                </div>
                <button type="submit" className='bg-primary px-10 py-3 mt-4 text-white rounded-full'>Add Doctor</button>

            </div>
        </form>
    );
};

export default AddDoctor;