import joi from "joi";
export const folderValidation = (req, res, next) => {
const schema = joi.object({
name: joi.string().trim().min(1).max(40).required()
});
const { error } = schema.validate(req.body);
if (error) {
return res.status(400).json({ message: "Folder name must be 1-40 characters" });
}
next();
};