import api from "../lib/axios";
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../lib/utils';

function Login() {

    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo({ ...loginInfo, [name]: value });
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('email and password are required')
        }
        try {


            const response = await api.post("/auth/login", loginInfo);
            const { success, message, jwtToken, name, error } = response.data;

            if (success) {
                handleSuccess(message || "Login Successful");
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/HomePage')
                }, 1000)
            } else if (error) {
                const details = error?.details[0].message || error;
                handleError(details);
            } else {
                handleError(message || "Login failed");
            }
            //console.log(result);
        } catch (err) {
            console.error("Login error:", err);
            handleError(err);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-lg mb-1" htmlFor="email">Email</label>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            onChange={handleChange}
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={loginInfo.email}
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
                            value={loginInfo.password}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary hover:underline">
                        Signup
                    </Link>
                </p>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Login