import { PenSquareIcon, PinIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
const NoteCard = ({ note, onChanged }) => {
    const handleDelete = async (e, id) => {
        e.preventDefault(); // get rid of the navigation behaviour
        if (!window.confirm("Move this note to Trash?")) return;
        try {
            await api.delete(`/notes/${id}`);
            toast.success("Note moved to Trash");
            onChanged();
        } catch (error) {
            console.log("Error in handleDelete", error);
            toast.error("Failed to delete note");
        }
    };
    const handlePin = async (e) => {
        e.preventDefault();
        try {
            const res = await api.patch(`/notes/${note._id}/pin`);
            toast.success(res.data.pinned ? "Note pinned" : "Note unpinned");
            onChanged();
        } catch (error) {
            console.log("Error in handlePin", error);
            toast.error("Failed to pin note");
        }
    };
    return (
        <Link
            to={`/note/${note._id}`}
            className="card bg-base-100 hover:shadow-lg transition-all duration-200 
      border-t-4 border-solid border-[#00FF9D]"
        >
            <div className="card-body">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="card-title text-base-content">{note.title}</h3>
                    <button
                        className={`btn btn-ghost btn-xs ${note.pinned ? "text-primary" : "opacity-50"}`}
                        onClick={handlePin}
                        title={note.pinned ? "Unpin" : "Pin"}
                    >
                        <PinIcon className={`size-4 ${note.pinned ? "fill-current" : ""}`} />
                    </button>
                </div>
                <p className="text-base-content/70 line-clamp-3">{note.content}</p>
                {note.checklist?.length > 0 && (
                    <span className="text-sm text-base-content/60">
                        ☑ {note.checklist.filter((item) => item.done).length}/{note.checklist.length} done
                    </span>
                )}
                {note.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                            <span key={tag} className="badge badge-outline badge-sm">#{tag}</span>
                        ))}
                    </div>
                )}
                <div className="card-actions justify-between items-center mt-4">
                    <span className="text-sm text-base-content/60">
                        {formatDate(new Date(note.createdAt))}
                    </span>
                    <div className="flex items-center gap-1">
                        <PenSquareIcon className="size-4" />
                        <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={(e) => handleDelete(e, note._id)}
                        >
                            <Trash2Icon className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};
export default NoteCard;