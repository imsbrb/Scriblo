import Note from "../models/Note.js";
// GET /api/notes/trash : the user's deleted notes, most recently deleted first
export async function getTrash(req, res) {
    try {
        const notes = await Note.find({ user: req.user._id, isDeleted: true }).sort({ deletedAt: -1 });
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error in getTrash Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
        }
}
// PATCH /api/notes/:id/restore : take a note out of Trash
export async function restoreNote(req, res) {
    try {
        const note = await Note.findOneAndUpdate(
                    { _id: req.params.id, user: req.user._id, isDeleted: true },
                    { isDeleted: false, deletedAt: null },
                    { new: true }
                    );
        if (!note) return res.status(404).json({ message: "Note not found in Trash" });
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in restoreNote Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// DELETE /api/notes/:id/permanent : delete forever (only notes already in Trash)
export async function deleteForever(req, res) {
    try {
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id, isDeleted: true });
        if (!note) return res.status(404).json({ message: "Note not found in Trash" });
        res.status(200).json({ message: "Note permanently deleted" });
    } catch (error) {
        console.error("Error in deleteForever Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}