import { useEffect, useState } from "react";
import api from "../lib/axios";
// dropdown of the user's folders; value "" means "no folder"
const FolderSelect = ({ value, onChange }) => {
    const [folders, setFolders] = useState([]);
    useEffect(() => {
        api
            .get("/folders")
            .then((res) => setFolders(res.data))
            .catch((error) => console.log("Error fetching folders", error));
    }, []);
    return (
        <select className="select select-bordered w-full" value={value || ""} onChange={(e) => onChange(e.target.value)}>
            <option value="">No folder</option>
            {folders.map((folder) => (
                <option key={folder._id} value={folder._id}>
                    {folder.name}
                </option>
            ))}
        </select>
    );
};
export default FolderSelect;