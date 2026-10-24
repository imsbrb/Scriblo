import mongoose from "mongoose";
const noteSchema = new mongoose.Schema({
title: {type:String, required:true},
content: {type:String, required:true},
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true
},
folder: {
type: mongoose.Schema.Types.ObjectId,
ref: "Folder",
default: null
},
tags: { type: [String], default: [] },
pinned: { type: Boolean, default: false },
isDeleted: { type: Boolean, default: false },   // true = the note is in Trash
deletedAt: { type: Date, default: null }
},
{timestamps: true}
);
const Note = mongoose.model("Note",noteSchema);
export default Note;