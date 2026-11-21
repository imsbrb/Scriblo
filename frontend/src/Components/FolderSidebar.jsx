import { useState } from "react";
import {
    CheckIcon, ChevronsLeftIcon, ChevronsRightIcon, FolderIcon, FolderPlusIcon, NotebookIcon, PencilIcon, Trash2Icon, XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";

// remember open/closed between visits (storage can be blocked, so guard it)
const readOpen = () => {
    try {
        return localStorage.getItem("sidebarOpen") !== "false";
    } catch {
        return true;
    }
};

const FolderSidebar = ({ folders, selected, onSelect, onFoldersChanged, noteCount }) => {
    const [open, setOpen] = useState(readOpen);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    const toggle = () => {
        setOpen(!open);
        try {
            localStorage.setItem("sidebarOpen", String(!open));
        } catch {
            /* ignore */
        }
    };

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

    // selected item = black bar with white text, like the template's buttons
    const rowClass = (value) =>
        `group flex items-center gap-3 w-full border-2 px-3 py-2 text-left font-medium transition-colors ${selected === value
            ? "bg-black text-white border-black"
            : "border-transparent hover:border-black hover:bg-base-200"
        } ${open ? "" : "justify-center px-0"}`;

    const Item = ({ value, icon: Icon, label }) => (
        <li>
            <button className={rowClass(value)} onClick={() => onSelect(value)} title={label}>
                <Icon className="size-5 shrink-0" />
                {open && <span className="truncate">{label}</span>}
            </button>
        </li>
    );

    return (
        <aside className={`card bg-base-100 h-fit transition-all duration-300 lg:sticky lg:top-6 ${open ? "lg:w-64" : "lg:w-[72px]"}`}>
            <div className={`card-body gap-3 ${open ? "p-4" : "p-2 items-center"}`}>
                {/* header: title + open/close button */}
                <div className={`flex items-center w-full ${open ? "justify-between" : "justify-center"}`}>
                    {open && (
                        <h2 className="text-2xl leading-none">
                            My Notes <span className="font-sans text-sm font-semibold align-middle">({noteCount})</span>
                        </h2>
                    )}
                    <button
                        onClick={toggle}
                        className="btn btn-sm btn-square btn-outline"
                        title={open ? "Close sidebar" : "Open sidebar"}
                        aria-label={open ? "Close sidebar" : "Open sidebar"}
                        aria-expanded={open}
                    >
                        {open ? <ChevronsLeftIcon className="size-4" /> : <ChevronsRightIcon className="size-4" />}
                    </button>
                </div>

                <ul className="w-full space-y-1">
                    <Item value="" icon={NotebookIcon} label="All notes" />
                </ul>

                <div className="w-full border-t-2 border-dashed border-black" />

                {open && (
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-base-content/60">My folders</p>
                )}

                <ul className="w-full space-y-1 max-h-[45vh] overflow-y-auto">
                    {open && folders.length === 0 && (
                        <li className="text-sm text-base-content/60">No folders yet. Create one below.</li>
                    )}

                    {folders.map((folder) =>
                        editingId === folder._id && open ? (
                            <li key={folder._id}>
                                <form onSubmit={(e) => handleRename(e, folder._id)} className="flex gap-1">
                                    <input
                                        className="input input-sm w-full"
                                        value={editName}
                                        maxLength={40}
                                        autoFocus
                                        onChange={(e) => setEditName(e.target.value)}
                                    />
                                    <button type="submit" className="btn btn-ghost btn-sm btn-square" title="Save">
                                        <CheckIcon className="size-4" />
                                    </button>
                                    <button type="button" className="btn btn-ghost btn-sm btn-square" title="Cancel" onClick={() => setEditingId(null)}>
                                        <XIcon className="size-4" />
                                    </button>
                                </form>
                            </li>
                        ) : (
                            <li key={folder._id} className={rowClass(folder._id)}>
                                <button className="flex items-center gap-3 grow min-w-0 text-left" onClick={() => onSelect(folder._id)} title={folder.name}>
                                    <FolderIcon className="size-5 shrink-0" />
                                    {open && <span className="truncate">{folder.name}</span>}
                                </button>
                                {open && (
                                    // edit/delete appear on hover on desktop, always visible on phones
                                    <span className="flex shrink-0 lg:hidden lg:group-hover:flex lg:group-focus-within:flex">
                                        <button className="btn btn-ghost btn-xs" onClick={() => startRename(folder)} title="Rename">
                                            <PencilIcon className="size-3.5" />
                                        </button>
                                        <button className="btn btn-ghost btn-xs text-error" onClick={() => handleDelete(folder)} title="Delete">
                                            <Trash2Icon className="size-3.5" />
                                        </button>
                                    </span>
                                )}
                            </li>
                        )
                    )}
                </ul>

                {open ? (
                    <form onSubmit={handleCreate} className="flex gap-2 w-full">
                        <input
                            className="input input-sm w-full"
                            placeholder="New folder"
                            value={newName}
                            maxLength={40}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-sm btn-square" title="Create folder">
                            <FolderPlusIcon className="size-4" />
                        </button>
                    </form>
                ) : (
                    <button onClick={toggle} className="btn btn-primary btn-sm btn-square" title="New folder">
                        <FolderPlusIcon className="size-4" />
                    </button>
                )}
            </div>
        </aside>
    );
};

export default FolderSidebar;