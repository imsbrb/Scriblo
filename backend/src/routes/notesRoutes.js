import express from "express";
import {createNotes, deleteNote, getAllNotes, updateNote ,getNoteById, getTags, togglePin} from 
"../Controllers/notesController.js";
import authmiddleware from "../middleware/authmiddleware.js";

const router = express.Router();
router.use(authmiddleware);
router.get("/",getAllNotes);
router.get("/tags",getTags);      // must come before "/:id", or "tags" is read as an id

router.get("/:id",getNoteById);
router.post("/",createNotes);
router.put("/:id",updateNote);
router.patch("/:id/pin",togglePin);
router.delete("/:id",deleteNote);

export default router;