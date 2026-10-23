import mongoose from "mongoose";
//1st step: create schema 
//2nd step: model based on that schema
const noteSchema = new mongoose.Schema({
title: {type:String, required:true},
content: {type:String, required:true},

user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
}
},
{timestamps: true}
);
const Note = mongoose.model("Note",noteSchema);
export default Note;