import jwt from "jsonwebtoken";
const authmiddleware = (req, res, next) => {
//const token = req.header("Authorization");
const authHeader = req.header("Authorization");
const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : 
authHeader;
if (!token) return res.status(403).json({ message: "Access Denied" });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded;
next();
} catch (error) {
res.status(403).json({ message: "Invalid Token" });
}
};
export default authmiddleware;