import express from "express";

import {createNotes, deleteNote, getAllNotes, updateNote ,getNoteById, getTags, togglePin} from 
"../Controllers/notesController.js";
import { getTrash, restoreNote, deleteForever } from "../Controllers/trashController.js";
import { addItem, updateItem, deleteItem } from "../Controllers/checklistController.js";
import { getSharedWithMe, shareNote, unshareNote } from "../Controllers/shareController.js";
import authmiddleware from "../middleware/authmiddleware.js";
const router = express.Router();
router.use(authmiddleware);            // fixed paths first, so "tags" or "trash" is never read as an :id

router.get("/",getAllNotes);
router.get("/tags",getTags);
router.get("/trash",getTrash);
router.get("/shared",getSharedWithMe);
router.get("/:id",getNoteById);
router.post("/",createNotes);
router.put("/:id",updateNote);
router.patch("/:id/pin",togglePin);
router.delete("/:id",deleteNote);              
router.patch("/:id/restore",restoreNote);
router.delete("/:id/permanent",deleteForever);
// moves the note to Trash
// checklist items inside a note

router.post("/:id/checklist",addItem);
router.patch("/:id/checklist/:itemId",updateItem);
router.delete("/:id/checklist/:itemId",deleteItem);
// sharing (viewer only)

router.post("/:id/share",shareNote);
router.delete("/:id/share/:userId",unshareNote);

export default router;