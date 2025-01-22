import React from 'react';
import {assets} from "../assets/assets.js";
import {NavLink} from "react-router-dom";

const Footer = () => {
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
                {/*{.....left-section....}*/}
                <div>
                    <img className="mb-5 w-40" src={assets.logo} alt=""/>
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">Our <b>VitalBookings</b> makes it easy for people to find and book appointments with trusted doctors. Users can browse a list of top doctors, view their specialties, and check their availability. With just a few clicks, they can secure an appointment that fits their schedule. </p>
                </div>

                {/*{.....middle-section....}*/}
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col text-gray-600 gap-2">
                    <NavLink to='/'>
                        <li>Home</li>
                    </NavLink>
                    <NavLink to='/about'>
                        <li>About us</li>

                    </NavLink>
                    <NavLink to="/contact">
                        <li>Contact us</li>
                    </NavLink>
                    <NavLink to="/contact">
                        <li>Privacy Policies</li>
                    </NavLink>
                </ul>
                </div>
                {/*{.....right-section....}*/}
                <div>
                    <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
                    <ul className="flex flex-col text-gray-600 gap-2">
                        <li>+1234567890</li>
                        <li> vitalsbokking@gmail.com</li>
                    </ul>
                </div>
            </div>

                {/*{.....bottom-section....}*/}
            <div>
                <hr/>
                <p className="py-5 text-sm text-center "> 2024 @VitalBookings. All Rights Reserved.</p>
            </div>
        </div>
    );
};

export default Footer;