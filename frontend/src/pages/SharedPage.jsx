import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, EyeIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { formatDate } from "../lib/utils";
const SharedPage = () => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchShared = async () => {
            try {
                const res = await api.get("/notes/shared");
                setNotes(res.data);
            } catch (error) {
                console.log("Error fetching shared notes", error);
                toast.error("Failed to load shared notes");
            } finally {
                setLoading(false);
            }
        };
        fetchShared();
    }, []);
    return (
        <div className="min-h-screen bg-base-200">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <Link to="/HomePage" className="btn btn-ghost mb-6">
                    <ArrowLeftIcon className="size-5" />
                    Back to Notes
                </Link>
                <h2 className="text-2xl font-bold mb-6">Shared with me</h2>
                {loading && <div className="text-center text-primary py-10">Loading...</div>}
                {!loading && notes.length === 0 && (
                    <p className="text-center text-base-content/70 py-16">Nobody has shared a note with you yet.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <Link key={note._id} to={`/note/${note._id}`} className="card bg-base-100 hover:shadow-lg transition-all">
                            <div className="card-body">
                                <h3 className="card-title">{note.title}</h3>
                                <p className="text-base-content/70 line-clamp-3">{note.content}</p>
                                <div className="flex justify-between items-center mt-4 text-sm text-base-content/60">
                                    <span>From {note.user.name}</span>
                                    <span className="flex items-center gap-1">
                                        <EyeIcon className="size-4" /> Viewer
                                    </span>
                                </div>
                                <span className="text-xs text-base-content/50">Updated {formatDate(new Date(note.updatedAt))}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default SharedPage;