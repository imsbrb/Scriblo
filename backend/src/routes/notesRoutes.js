import express from "express";
import {createNotes, deleteNote, getAllNotes, updateNote ,getNoteById, getTags} from 
"../Controllers/notesController.js";
import authmiddleware from "../middleware/authmiddleware.js";
const router = express.Router();
router.use(authmiddleware);
router.get("/",getAllNotes);
router.get("/tags",getTags);      // must come before "/:id", or "tags" is read as an id
router.get("/:id",getNoteById);
router.post("/",createNotes);
router.put("/:id",updateNote);
router.delete("/:id",deleteNote);
export default router;