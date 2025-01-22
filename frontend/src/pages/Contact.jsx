import React from 'react';
import {assets} from "../assets/assets.js";

const Contact = () => {
    return (
        <div>
            <div className="text-center text-2xl text-gray-500 pt-10">
                <p>CONTACT <span className="text-gray-700 font-semibold"> US</span></p>
            </div>
            <div>
                <div className="my-10 flex flex-col justify-center md:flex-row gap-12 mb-28 text-sm">
                    <img className="w-full md:max-w-[360px]" src={assets.contact_image} alt="" />
                    <div className="flex flex-col justify-center items-start gap-6">
                        <p className="text-lg font-semibold text-gray-600">OUR OFFICE</p>
                        <p className="text-gray-500">54709 Willms Station <br/>Suite 350, Washington, USA</p>
                        <p className="text-gray-500">Tel: (415) 555‑0132<br/>Email: greatstackdev@gmail.com</p>
                        <p className="text-lg font-semibold text-gray-600">Careers at VitalBookings</p>
                        <p className="text-gray-500">Learn more about our teams and job openings.</p>
                        <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">Explore Jobs</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;