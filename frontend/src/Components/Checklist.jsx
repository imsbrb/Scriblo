import { useState } from "react";
import { CheckIcon, PencilIcon, PlusIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
// Every change is saved straight away. The server sends back the whole updated
// checklist, so we just replace our copy with it.
const Checklist = ({ noteId, items, setItems, readOnly = false }) => {
    const [newText, setNewText] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState("");
    const showError = (error, fallback) => toast.error(error.response?.data?.message || fallback);
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newText.trim()) return;
        try {
            const res = await api.post(`/notes/${noteId}/checklist`, { text: newText });
            setItems(res.data);
            setNewText("");
        } catch (error) {
            showError(error, "Failed to add item");
        }
    };
    const handleToggle = async (item) => {
        try {
            const res = await api.patch(`/notes/${noteId}/checklist/${item._id}`, {
                done: !item.done
            });
            setItems(res.data);
        } catch (error) {
            showError(error, "Failed to update item");
        }
    };
    const handleEdit = async (e, itemId) => {
        e.preventDefault();
        if (!editText.trim()) return;
        try {
            const res = await api.patch(`/notes/${noteId}/checklist/${itemId}`, { text: editText });
            setItems(res.data);
            setEditingId(null);
        } catch (error) {
            showError(error, "Failed to edit item");
        }
    };
    const handleRemove = async (itemId) => {
        try {
            const res = await api.delete(`/notes/${noteId}/checklist/${itemId}`);
            setItems(res.data);
        } catch (error) {
            showError(error, "Failed to remove item");
        }
    };
    const doneCount = items.filter((item) => item.done).length;
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="label-text">Checklist</span>
                {items.length > 0 && (
                    <span className="text-sm text-base-content/60">
                        {doneCount}/{items.length} done
                    </span>
                )}
            </div>
            {items.length === 0 && readOnly && <p className="text-sm text-base-content/60">No
                checklist items.</p>}
            <ul className="space-y-1">
                {items.map((item) => (
                    <li key={item._id} className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="checkbox checkbox-primary checkbox-sm"
                            checked={item.done}
                            disabled={readOnly}
                            onChange={() => handleToggle(item)}
                        />
                        {editingId === item._id ? (
                            <form onSubmit={(e) => handleEdit(e, item._id)} className="flex gap-1 grow">
                                <input
                                    className="input input-bordered input-sm grow"
                                    value={editText}
                                    autoFocus
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <button type="submit" className="btn btn-ghost btn-sm btn-square">
                                    <CheckIcon className="size-4" />
                                </button>
                                <button type="button" className="btn btn-ghost btn-sm btn-square" onClick={() =>
                                    setEditingId(null)}>
                                    <XIcon className="size-4" />
                                </button>
                            </form>
                        ) : (
                            <>
                                <span className={`grow ${item.done ? "line-through text-base-content/50" : ""}`}>{item.text}</span>
                                {!readOnly && (
                                    <>
                                        <button
                                            className="btn btn-ghost btn-xs"
                                            title="Edit"
                                            onClick={() => {
                                                setEditingId(item._id);
                                                setEditText(item.text);
                                            }}
                                        >
                                            <PencilIcon className="size-3" />
                                        </button>
                                        <button className="btn btn-ghost btn-xs text-error" title="Remove" onClick=
                                            {() => handleRemove(item._id)}>
                                            <XIcon className="size-3" />
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
            {!readOnly && (
                <form onSubmit={handleAdd} className="flex gap-1 mt-2">
                    <input
                        className="input input-bordered input-sm grow"
                        placeholder="Add an item"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm btn-square" title="Add">
                        <PlusIcon className="size-4" />
                    </button>
                </form>
            )}
        </div>
    );
};
export default Checklist;