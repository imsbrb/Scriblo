import React, { useState } from "react";
import api from "../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from "../lib/utils";
function Signup() {

    const [signupInfo, setSignupInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        const copySignupInfo = { ...signupInfo };
        copySignupInfo[name] = value;
        setSignupInfo(copySignupInfo);
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        const { name, email, password } = signupInfo;
        if (!name || !email || !password) {
            return handleError('name, email and password are required')
        }
        if (name.length < 3) {
            return handleError('Name must be at least 3 characters long');
        }
        try {

            const response = await api.post("/auth/signup", signupInfo);
            const result = response.data;
            const { success, message, error } = result;

            if (success) {
                handleSuccess(message || "Signup successful")
                setTimeout(() => navigate('/login'), 1000);
            } else if (error) {
                const details = error?.details[0].message || error;
                handleError(details);
            } else {
                handleError(message || "Signup Failed");
            }
            //console.log(result);
        } catch (err) {
            console.error("Signup error:", err);
            handleError(err.message || "Signup Failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Signup</h1>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block text-lg mb-1" htmlFor="name">Name</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            type="text"
                            name="name"
                            autoFocus
                            placeholder="Enter your name...(Greater than three)"
                            value={signupInfo.name}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg mb-1" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={signupInfo.email}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-lg mb-1" htmlFor="password">Password</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={signupInfo.password}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
                    >
                        Signup
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Signup