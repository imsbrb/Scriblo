import Note from "../models/Note.js";

// checklist changes are only allowed on the user's own notes that aren't in Trash

function findOwnNote(req) {
return Note.findOne({ _id: req.params.id, user: req.user._id, isDeleted: false });
}

// POST /api/notes/:id/checklist  { text }
export async function addItem(req, res) {
     try {
        const text = String(req.body.text || "").trim();
        if (!text) return res.status(400).json({ message: "Checklist item can't be empty" });
        const note = await findOwnNote(req);
        if (!note) return res.status(404).json({ message: "Note not found!" });
        note.checklist.push({ text });
        await note.save();
        res.status(201).json(note.checklist);
    } catch (error) {
        console.error("Error in addItem Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// PATCH /api/notes/:id/checklist/:itemId  { text?, done? }
export async function updateItem(req, res) {
    try {
        const note = await findOwnNote(req);
        if (!note) return res.status(404).json({ message: "Note not found!" });
        const item = note.checklist.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: "Checklist item not found!" });
        const { text, done } = req.body;
        if (text !== undefined) {
            if (!String(text).trim()) return res.status(400).json({ message: "Checklist item can't be empty" });
            item.text = String(text).trim();
        }
        if (done !== undefined) item.done = Boolean(done);
        await note.save();
        res.status(200).json(note.checklist);
    } catch (error) {
        console.error("Error in updateItem Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
// DELETE /api/notes/:id/checklist/:itemId
export async function deleteItem(req, res) {
    try {
        const note = await findOwnNote(req);
        if (!note) return res.status(404).json({ message: "Note not found!" });
        const item = note.checklist.id(req.params.itemId);
        if (!item) return res.status(404).json({ message: "Checklist item not found!" });
        // keep every item except the one being removed
        note.checklist = note.checklist.filter((i) => !i._id.equals(item._id));
        await note.save();
        res.status(200).json(note.checklist);
    } catch (error) {
        console.error("Error in deleteItem Controller", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}