import express from "express";
import { connectDB } from "./configurations/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import folderRoutes from "./routes/folderRoutes.js";
import ratelimiter from "./middleware/rateLimiter.js";
import path from "path";
dotenv.config()
const app=express();
const PORT = process.env.PORT || 5001;
const __dirname=path.resolve();
//middleware
if(process.env.NODE_ENV !== "production"){
app.use(
cors({
origin: "http://localhost:5173"
})
);
}
app.use(express.json());
// Trust proxy to get correct IP addresses
app.set('trust proxy', 1);
app.use(ratelimiter);
app.use("/api/auth", authRoutes);
app.use("/api/notes",notesRoutes);
app.use("/api/folders", folderRoutes);
if(process.env.NODE_ENV === "production"){
app.use(express.static(path.join(__dirname,"../frontend/dist")));
app.get("*", (req, res) => {
res.sendFile(path.join(__dirname, "../frontend","dist","index.html"));
});
}
connectDB().then(()=>{
app.listen(PORT,() =>{
console.log("Server started on port:",PORT);
});
});
