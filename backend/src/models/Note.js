import mongoose from "mongoose";

// one checklist item; each gets its own _id so it can be edited or removed
const checklistItemSchema = new mongoose.Schema({
    text: { type: String, required: true, trim: true },
    done: { type: Boolean, default: false }
});

// who a note is shared with; "viewer" can read the note but not change it
const shareSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    permission: { type: String, enum: ["viewer"], default: "viewer" }
}, { _id: false });
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
    checklist: { type: [checklistItemSchema], default: [] },
    sharedWith: { type: [shareSchema], default: [] },
    pinned: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },   // true = the note is in Trash
    deletedAt: { type: Date, default: null }
},
{timestamps: true}
);

const Note = mongoose.model("Note",noteSchema);
export default Note;