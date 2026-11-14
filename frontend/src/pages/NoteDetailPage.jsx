import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, EyeIcon, LoaderIcon, Share2Icon, Trash2Icon } from "lucide-react";
import FolderSelect from "../Components/FolderSelect";
import TagInput from "../Components/TagInput";
import Checklist from "../Components/Checklist";
import ShareDialog from "../Components/ShareDialog";
const NoteDetailPage = () => {
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        const fetchNote = async () => {
            try {
                const res = await api.get(`/notes/${id}`);
                setNote(res.data);
            } catch (error) {
                console.log("Error in fetching note", error);
                toast.error("Failed to fetch the note");
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);
    const handleDelete = async () => {
        if (!window.confirm("Move this note to Trash?")) return;
        try {
            await api.delete(`/notes/${id}`);
            toast.success("Note moved to Trash");
            navigate("/HomePage");
        } catch (error) {
            console.log("Error deleting the note:", error);
            toast.error("Failed to delete note");
        }
    };
    const handleSave = async () => {
        if (!note.title.trim() || !note.content.trim()) {
            toast.error("Please add a title or content");
            return;
        }
        setSaving(true);
        try {
            await api.put(`/notes/${id}`, {
                title: note.title,
                content: note.content,
                folder: note.folder,
                tags: note.tags,
            });
            toast.success("Note updated successfully");
            navigate("/HomePage");
        } catch (error) {
            console.log("Error saving the note:", error);
            toast.error(error.response?.data?.message || "Failed to update note");
        } finally {
            setSaving(false);
        }
    };
    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="animate-spin size-10" />
            </div>
        );
    }
    if (!note) {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
                <p>This note doesn't exist or you don't have access to it.</p>
                <Link to="/HomePage" className="btn btn-primary">Back to Notes</Link>
            </div>
        );
    }
    // a note shared with me: show it read-only, with no edit, delete or share buttons
    if (note.role === "viewer") {
        return (
            <div className="min-h-screen bg-base-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Link to="/shared" className="btn btn-ghost mb-6">
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to Shared
                        </Link>
                        <div className="card bg-base-100">
                            <div className="card-body">
                                <div className="flex items-center justify-between gap-2">
                                    <h2 className="card-title text-2xl">{note.title}</h2>
                                    <span className="badge badge-ghost gap-1 shrink-0">
                                        <EyeIcon className="size-3" /> View only
                                    </span>
                                </div>
                                <p className="text-sm text-base-content/60">Shared by {note.user.name}</p>
                                <p className="whitespace-pre-wrap mt-4">{note.content}</p>
                                {note.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-4">
                                        {note.tags.map((tag) => (
                                            <span key={tag} className="badge badge-outline badge-sm">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-6">
                                    <Checklist noteId={id} items={note.checklist || []} setItems={() => { }}
                                        readOnly />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <Link to="/HomePage" className="btn btn-ghost">
                            <ArrowLeftIcon className="h-5 w-5" />
                            Back to Notes
                        </Link>
                        <div className="flex gap-2">
                            <button onClick={() => setShowShare(true)} className="btn btn-outline">
                                <Share2Icon className="h-5 w-5" />
                                Share
                            </button>
                            <button onClick={handleDelete} className="btn btn-error btn-outline">
                                <Trash2Icon className="h-5 w-5" />
                                Delete Note
                            </button>
                        </div>
                    </div>
                    <div className="card bg-base-100">
                        <div className="card-body">
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Note title"
                                    className="input input-bordered"
                                    value={note.title}
                                    onChange={(e) => setNote({ ...note, title: e.target.value })}
                                />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Content</span>
                                </label>
                                <textarea
                                    placeholder="Write your note here..."
                                    className="textarea textarea-bordered h-32"
                                    value={note.content}
                                    onChange={(e) => setNote({ ...note, content: e.target.value })}
                                />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Folder</span>
                                </label>
                                <FolderSelect value={note.folder} onChange={(folder) => setNote({
                                    ...note,
                                    folder
                                })} />
                            </div>
                            <div className="form-control mb-4">
                                <label className="label">
                                    <span className="label-text">Tags</span>
                                </label>
                                <TagInput tags={note.tags || []} setTags={(tags) => setNote({ ...note, tags })}
                                />
                            </div>
                            <div className="card-actions justify-end">
                                <button className="btn btn-primary" disabled={saving} onClick={handleSave}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* the checklist saves on its own, so it sits outside the Save Changes card */}
                    <div className="card bg-base-100 mt-6">
                        <div className="card-body">
                            <Checklist
                                noteId={id}
                                items={note.checklist || []}
                                setItems={(checklist) => setNote((prev) => ({ ...prev, checklist }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showShare && (
                <ShareDialog
                    noteId={id}
                    sharedWith={note.sharedWith || []}
                    setSharedWith={(sharedWith) => setNote((prev) => ({ ...prev, sharedWith }))}
                    onClose={() => setShowShare(false)}
                />
            )}
        </div>
    );
};
export default NoteDetailPage;
