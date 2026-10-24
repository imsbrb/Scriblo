import express from "express";
import { getFolders, createFolder, renameFolder, deleteFolder } from 
"../Controllers/folderController.js";
import { folderValidation } from "../middleware/folderValidation.js";
import authmiddleware from "../middleware/authmiddleware.js";
const router = express.Router();
router.use(authmiddleware);
router.get("/", getFolders);
router.post("/", folderValidation, createFolder);
router.put("/:id", folderValidation, renameFolder);
router.delete("/:id", deleteFolder);
export default router;