import Folder from "../models/Folder.js";
import Note from "../models/Note.js";

export async function getFolders(req, res) {
try {
const folders = await Folder.find({ user: req.user._id }).sort({ name: 1 });
res.status(200).json(folders);
} catch (error) {
console.error("Error in getFolders Controller", error);
res.status(500).json({ message: "Internal Server Error" });
}
}
export async function createFolder(req, res) {
try {
const name = req.body.name.trim();
const exists = await Folder.findOne({ user: req.user._id, name });
        if (exists) return res.status(400).json({ message: "You already have a folder with this name" });
        const folder = await Folder.create({ name, user: req.user._id });
        res.status(201).json(folder);
    } catch (error) {
        console.error("Error in createFolder Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export async function renameFolder(req, res) {
    try {
        const name = req.body.name.trim();
        const exists = await Folder.findOne({ user: req.user._id, name, _id: { $ne: 
req.params.id } });
        if (exists) return res.status(400).json({ message: "You already have a folder with this name" });
        const folder = await Folder.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { name },
            { new: true }
        );
        if (!folder) return res.status(404).json({ message: "Folder not found!" });
        res.status(200).json(folder);
    } catch (error) {
        console.error("Error in renameFolder Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
export async function deleteFolder(req, res) {
try {
const folder = await Folder.findOneAndDelete({ _id: req.params.id, user: req.user._id 
});
if (!folder) return res.status(404).json({ message: "Folder not found!" });
// deleting a folder also deletes every note inside it
const result = await Note.deleteMany({ folder: folder._id, user: req.user._id });
res.status(200).json({
message: `Folder and ${result.deletedCount} note(s) deleted`,
deletedNotes: result.deletedCount
});
} catch (error) {
console.error("Error in deleteFolder Controller", error);
res.status(500).json({ message: "Internal Server Error" });
}
}