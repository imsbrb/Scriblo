import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// Signup
export const signup = async (req, res) => {
try {
const { name, email, password } = req.body;
const exist = await User.findOne({ email });
if (exist) return res.status(400).json({ message: "User already exists"},);
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({ name, email, password: hashedPassword });
await newUser.save();
res.status(201).json({  success: true, message: "User registered successfully" });
} catch (error) {
res.status(500).json({ message: "Signup error",success:false});
} 
};
// Login
export const login = async (req, res) => {
try {
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) return res.status(403).json({ message: "Invalid email" });
const match = await bcrypt.compare(password, user.password);
if (!match) return res.status(403).json({ message: "Invalid password" });
const jwtToken = jwt.sign({ email:user.email,_id: user._id }, process.env.JWT_SECRET, { 
expiresIn: "1h" });
res.status(200).json({ 
message: "Login Successful",
success:true,
jwtToken,
email,
name:user.name
});
} catch (error) {
res.status(500).json({ message: "Login error", error: error.message });
}
};