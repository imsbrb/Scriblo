import Note from "../models/Note.js";
import User from "../models/user.js";
// GET /api/notes/shared : notes other users have shared with me
export async function getSharedWithMe(req, res) {
    try {
        const notes = await Note.find({ "sharedWith.user": req.user._id, isDeleted: false })
            .select("-sharedWith")
            .populate("user", "name email")
            .sort({ updatedAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getSharedWithMe Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// POST /api/notes/:id/share  { email } : only the owner can share, always as viewer
export async function shareNote(req, res) {
    try {
        const email = String(req.body.email || "").trim();
        if (!email) return res.status(400).json({ message: "Email is required" });
        const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
        if (!note) return res.status(404).json({ message: "Note not found!" });
        const otherUser = await User.findOne({ email });
        if (!otherUser) return res.status(404).json({ message: "No registered user with this email" });
        if (otherUser._id.toString() === req.user._id) {
            return res.status(400).json({ message: "You can't share a note with yourself" });
        }
        const alreadyShared = note.sharedWith.some((share) => share.user.toString() === otherUser._id.toString());
        if (alreadyShared) return res.status(400).json({ message: "Note is already shared with this user" });
        note.sharedWith.push({ user: otherUser._id, permission: "viewer" });
        await note.save();
        await note.populate("sharedWith.user", "name email");
        res.status(200).json(note.sharedWith);
    } catch (error) {
        console.error("Error in shareNote Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// DELETE /api/notes/:id/share/:userId : the owner stops sharing with one user
export async function unshareNote(req, res) {
try {
const note = await Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: 
false });
if (!note) return res.status(404).json({ message: "Note not found!" });
note.sharedWith = note.sharedWith.filter((share) => share.user.toString() !== 
req.params.userId);
await note.save();
await note.populate("sharedWith.user", "name email");
res.status(200).json(note.sharedWith);
} catch (error) {
console.error("Error in unshareNote Controller", error);
res.status(500).json({ message: "Internal Server Error" });
}
}