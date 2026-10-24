import mongoose from "mongoose";
import Note from "../models/Note.js";
import Folder from "../models/Folder.js";
// trim, lowercase, drop empty and duplicate tags (max 10 tags, 20 chars each)
function cleanTags(tags) {
if (!Array.isArray(tags)) return [];
const cleaned = tags
.map((tag) => String(tag).trim().toLowerCase())
.filter((tag) => tag.length > 0 && tag.length <= 20);
return [...new Set(cleaned)].slice(0, 10);
}
// a note can only go into a folder owned by the same user ("" or null = no folder)
async function folderIsValid(folderId, userId) {
    if (!folderId) return true;
    if (!mongoose.isValidObjectId(folderId)) return false;
    const folder = await Folder.findOne({ _id: folderId, user: userId });
    return !!folder;
}
// escape characters that have a special meaning in a regex, like . * ? ( )
function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
// GET /api/notes?search=&folder=&tag=&pinned=&sort=newest|oldest&page=1&limit=9
export async function getAllNotes(req,res){
    try{
        const {search, folder, tag, pinned, sort} = req.query;
        const filter = {user: req.user._id};
        if (search && search.trim()) {
            const regex = new RegExp(escapeRegex(search.trim()), "i");   // "i" = ignore case
            filter.$or = [{title: regex}, {content: regex}];
        }
        if (folder === "none") {
            filter.folder = null;                    // notes that aren't in any folder
        } else if (folder) {
            if (!mongoose.isValidObjectId(folder)) {
                return res.status(400).json({message: "Invalid folder"});
            }
            filter.folder = folder;
        }
        if (tag) filter.tags = String(tag).toLowerCase();
        if (pinned === "true") filter.pinned = true;
        if (pinned === "false") filter.pinned = {$ne: true};   // also matches older notes with 
no pinned field
        // pinned notes first, then by date (newest first unless sort=oldest)
        const order = {pinned: -1, createdAt: sort === "oldest" ? 1 : -1};
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 50);
        const [notes, total] = await Promise.all([
            Note.find(filter).sort(order).skip((page - 1) * limit).limit(limit),
            Note.countDocuments(filter)
        ]);
        res.status(200).json({
            notes,
            page,
            limit,
            total,
            totalPages: Math.max(Math.ceil(total / limit), 1)
        });
    }catch(error){
        console.error("Error in getAllNotes Controller",error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getTags(req, res){
    try {
        const tags = await Note.distinct("tags", {user: req.user._id});
        res.status(200).json(tags.sort());
    } catch (error) {
        console.error("Error in getTags Controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export async function getNoteById(req, res){
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id });
        if (!note) return res.status(404).json({message: "Note not found!"})
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in getNoteById Controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export async function createNotes(req,res){
    try{
        const {title, content, folder, tags}=req.body;
        if (!(await folderIsValid(folder, req.user._id))) {
            return res.status(400).json({message: "Folder not found"});
        }
        const note=new Note({
            title,
            content,
            user: req.user._id,
            folder: folder || null,
            tags: cleanTags(tags)
        });
        const savedNote = await note.save();
        res.status(201).json(savedNote);
    }catch(error){
        console.error("Error in createNotes Controller",error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export async function updateNote(req,res){
    try {
        const {title, content, folder, tags}=req.body;
        // only change the fields that were sent, so moving a note can send just { folder }
        const changes = {};
        if (title !== undefined) changes.title = title;
        if (content !== undefined) changes.content = content;
        if (tags !== undefined) changes.tags = cleanTags(tags);
        if (folder !== undefined) {
            if (!(await folderIsValid(folder, req.user._id))) {
                return res.status(400).json({message: "Folder not found"});
            }
            changes.folder = folder || null;
        }
        const updatedNote=await Note.findOneAndUpdate(
            {_id: req.params.id, user: req.user._id},
            changes,
            {new:true, runValidators:true}
        );
        if (!updatedNote) return res.status(404).json({message: "Note not found!"})
        res.status(200).json(updatedNote);
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({message: "Title and content can't be empty"});
        }
        console.error("Error in updateNote Controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}
export async function togglePin(req, res){
    try {
        const note = await Note.findOne({_id: req.params.id, user: req.user._id});
        if (!note) return res.status(404).json({message: "Note not found!"});
        note.pinned = !note.pinned;
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in togglePin Controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function deleteNote(req,res){
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id 
});
        if (!deletedNote) return res.status(404).json({message: "Note not found!"})
        res.status(200).json({message: "Note deleted successfully!"});
    } catch (error) {
        console.error("Error in deleteNote Controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}