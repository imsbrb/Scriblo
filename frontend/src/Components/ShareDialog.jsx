import { useState } from "react";
import { UserMinusIcon, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
// modal where the owner shares a note by email; everyone added is a Viewer
const ShareDialog = ({ noteId, sharedWith, setSharedWith, onClose }) => {
    const [email, setEmail] = useState("");
    const [sending, setSending] = useState(false);
    const handleShare = async (e) => {
        e.preventDefault();
        if (!email.trim()) return;
        setSending(true);
        try {
            const res = await api.post(`/notes/${noteId}/share`, { email });
            setSharedWith(res.data);
            setEmail("");
            toast.success("Note shared as Viewer");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to share note");
        } finally {
            setSending(false);
        }
    };
    const handleRemove = async (userId) => {
        try {
            const res = await api.delete(`/notes/${noteId}/share/${userId}`);
            setSharedWith(res.data);
            toast.success("Access removed");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove access");
        }
    };
    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <button className="btn btn-ghost btn-sm btn-square absolute right-3 top-3" onClick={onClose}>
                    <XIcon className="size-4" />
                </button>
                <h3 className="font-bold text-lg mb-1">Share note</h3>
                <p className="text-sm text-base-content/60 mb-4">
                    People you add can read this note but can't edit or delete it.
                </p>
                <form onSubmit={handleShare} className="flex gap-2 mb-4">
                    <input
                        type="email"
                        className="input input-bordered grow"
                        placeholder="Their account email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary" disabled={sending}>
                        {sending ? "Sharing..." : "Share"}
                    </button>
                </form>
                {sharedWith.length === 0 && <p className="text-sm text-base-content/60">Not shared with
                    anyone yet.</p>}
                <ul className="space-y-2">
                    {sharedWith.map((share) => (
                        <li key={share.user._id} className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-medium truncate">{share.user.name}</p>
                                <p className="text-sm text-base-content/60 truncate">{share.user.email}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="badge badge-ghost">Viewer</span>
                                <button className="btn btn-ghost btn-xs text-error" title="Remove access" onClick={() => handleRemove(share.user._id)}>
                                    <UserMinusIcon className="size-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>
    );
};
export default ShareDialog;