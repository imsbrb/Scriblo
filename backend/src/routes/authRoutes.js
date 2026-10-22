import express from "express";
import { signup, login } from "../Controllers/authController.js";
import { signupvalidation ,loginvalidation} from "../middleware/authValidation.js";
const router = express.Router();
router.post("/signup",signupvalidation ,signup);
router.post("/login",loginvalidation ,login);

export default router;