import { useState } from "react";
import {
    CheckIcon, FolderIcon, FolderPlusIcon, InboxIcon, NotebookIcon, PencilIcon, Trash2Icon,
    XIcon
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
const FolderSidebar = ({ folders, selected, onSelect, onFoldersChanged }) => {
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");
    // show the server's message ("You already have a folder with this name") if there is one
    const showError = (error, fallback) => toast.error(error.response?.data?.message || fallback);
    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await api.post("/folders", { name: newName });
            setNewName("");
            toast.success("Folder created");
            onFoldersChanged();
        } catch (error) {
            showError(error, "Failed to create folder");
        }
    };
    const startRename = (folder) => {
        setEditingId(folder._id);
        setEditName(folder.name);
    };
    const handleRename = async (e, id) => {
        e.preventDefault();
        if (!editName.trim()) return;
        try {
            await api.put(`/folders/${id}`, { name: editName });
            setEditingId(null);
            toast.success("Folder renamed");
            onFoldersChanged();
        } catch (error) {
            showError(error, "Failed to rename folder");
        }
    };
    const handleDelete = async (folder) => {
        if (!window.confirm(`Delete "${folder.name}" and every note inside it? This can't be undone.`)) return;
        try {
            const res = await api.delete(`/folders/${folder._id}`);
            toast.success(res.data.message);
            if (selected === folder._id) onSelect("");
            onFoldersChanged();
        } catch (error) {
            showError(error, "Failed to delete folder");
        }
    };
    // highlight the folder the notes are currently filtered by
    const itemClass = (value) =>
        `flex items-center gap-2 w-full text-left rounded-lg px-2 py-1 ${selected === value ? "bg-primary/15 font-semibold" : "hover:bg-base-200"
        }`;
    return (
        <aside className="card bg-base-100 h-fit">
            <div className="card-body p-4">
                <h2 className="font-bold text-lg">Folders</h2>
                <ul className="space-y-1">
                    <li>
                        <button className={itemClass("")} onClick={() => onSelect("")}>
                            <NotebookIcon className="size-4" /> All notes
                        </button>
                    </li>
                    <li>
                        <button className={itemClass("none")} onClick={() => onSelect("none")}>
                            <InboxIcon className="size-4" /> No folder
                        </button>
                    </li>
                    <li className="divider my-1"></li>
                    {folders.length === 0 && <li className="text-sm text-base-content/60">No folders
                        yet</li>}
                    {folders.map((folder) => (
                        <li key={folder._id}>
                            {editingId === folder._id ? (
                                <form onSubmit={(e) => handleRename(e, folder._id)} className="flex gap-1">
                                    <input
                                        className="input input-bordered input-sm w-full"
                                        value={editName}
                                        maxLength={40}
                                        autoFocus
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-ghost btn-sm btn-square">
                                        <CheckIcon className="size-4" />
                                    </button>
                                    <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={() => setEditingId(null)}>
                                        <XIcon className="size-4" />
                                    </button>
                                </form>
                            ) : (
                                <div className={`flex items-center justify-between rounded-lg ${selected ===
                                    folder._id ? "bg-primary/15" : "hover:bg-base-200"}`}>
                                    <button className="flex items-center gap-2 truncate grow text-left px-2 py-1"
                                        onClick={() => onSelect(folder._id)}>
                                        <FolderIcon className="size-4 shrink-0" />
                                        {folder.name}
                                    </button>
                                    <span className="flex shrink-0">
                                        <button className="btn btn-ghost btn-xs" onClick={() => startRename(folder)}
                                            title="Rename">
                                            <PencilIcon className="size-3" />
                                        </button>
                                        <button className="btn btn-ghost btn-xs text-error" onClick={() =>
                                            handleDelete(folder)} title="Delete">
                                            <Trash2Icon className="size-3" />
                                        </button>
                                    </span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleCreate} className="flex gap-1 mt-2">
                    <input
                        className="input input-bordered input-sm w-full"
                        placeholder="New folder"
                        value={newName}
                        maxLength={40}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm btn-square" title="Create folder">
                        <FolderPlusIcon className="size-4" />
                    </button>
                </form>
            </div>
        </aside>
    );
};
export default FolderSidebar;