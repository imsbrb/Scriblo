import express from "express";
import { connectDB } from "./configurations/db.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config()

const app=express();
const PORT = process.env.PORT || 5001;

//middleware
if(process.env.NODE_ENV !== "production"){
    app.use(
        cors({
            origin: "http://localhost:5173"
        })
    );
}

app.use(express.json());

connectDB().then(()=>{
    app.listen(PORT,() =>{
        console.log("Server started on port:",PORT);
    });
});