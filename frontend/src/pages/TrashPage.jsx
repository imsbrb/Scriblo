import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, RotateCcwIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { formatDate } from "../lib/utils";
const TrashPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchTrash = async () => {
            try {
                const res = await api.get("/notes/trash");
                setNotes(res.data);
            } catch (error) {
                console.log("Error fetching trash", error);
                toast.error("Failed to load Trash");
            } finally {
                setLoading(false);
            }
        };
        fetchTrash();
    }, []);
    const handleRestore = async (id) => {
        try {
            await api.patch(`/notes/${id}/restore`);
            setNotes((prev) => prev.filter((note) => note._id !== id));
            toast.success("Note restored");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to restore note");
        }
    };
    const handleDeleteForever = async (id) => {
        if (!window.confirm("Delete this note forever? This can't be undone.")) return;
        try {
            await api.delete(`/notes/${id}/permanent`);
            setNotes((prev) => prev.filter((note) => note._id !== id));
            toast.success("Note permanently deleted");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete note");
        }
    };
    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link to="/HomePage" className="btn btn-ghost mb-6">
                    <ArrowLeftIcon className="size-5" />
                    Back to Notes
                </Link>
                <h2 className="text-2xl font-bold mb-6">Trash</h2>
                {loading && <div className="text-center text-primary py-10">Loading...</div>}
                {!loading && notes.length === 0 && (
                    <p className="text-center text-base-content/70 py-16">Trash is empty.</p>
                )}
                <div className="space-y-4">
                    {notes.map((note) => (
                        <div key={note._id} className="card bg-base-100">
                            <div className="card-body flex-row items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="font-semibold truncate">{note.title}</h3>
                                    <p className="text-sm text-base-content/60">
                                        Deleted {formatDate(new Date(note.deletedAt))}
                                    </p>
                                </div>
                                <div className="flex gap-2 shrink-0">
                                    <button className="btn btn-sm btn-outline" onClick={() => handleRestore(note._id)}>
                                        <RotateCcwIcon className="size-4" />
                                        Restore
                                    </button>
                                    <button className="btn btn-sm btn-error btn-outline" onClick={() => handleDeleteForever(note._id)}>
                                        <Trash2Icon className="size-4" />
                                        Delete forever
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default TrashPage;