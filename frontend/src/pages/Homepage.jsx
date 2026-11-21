import { useEffect, useState } from "react";
import RateLimitedUI from "../Components/RateLimitingUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../Components/NoteCard";
import FolderSidebar from "../Components/FolderSidebar";
import NoteFilters from "../Components/NoteFilters";
import Pagination from "../Components/Pagination";
import { Link } from "react-router-dom";
import { PlusIcon } from "lucide-react";
const emptyFilters = { search: "", folder: "", tag: "", pinned: "", sort: "newest", page: 1 };
const NewNoteCard = ({ message }) => (
    <Link to="/create" className="card bg-base-100/40 backdrop-blur-sm transition-all duration-200">
        <div className="card-body items-center justify-center text-center gap-3 min-h-48">
            <span className="flex items-center justify-center size-14 bg-black text-white">
                <PlusIcon className="size-8" />
            </span>
            <h3 className="card-title text-2xl">New Note</h3>
            {message && <p className="text-base-content/70">{message}</p>}
        </div>
    </Link>
);
const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [notes, setNotes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [folders, setFolders] = useState([]);
    const [tags, setTags] = useState([]);
    const [filters, setFilters] = useState(emptyFilters);
    const [loading, setLoading] = useState(true);
    const fetchNotes = async () => {
        try {
            // only send the filters that are set, e.g. /notes?search=lab&page=2
            const params = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== "") params[key] = value;
            });
            const res = await api.get("/notes", { params });
            setNotes(res.data.notes);
            setTotalPages(res.data.totalPages);
            setIsRateLimited(false);
        } catch (error) {
            if (error.response?.status === 429) {
                setIsRateLimited(true);
            } else {
                toast.error("Failed to load notes");
            }
        } finally {
            setLoading(false);
        }
    };
    const fetchFolders = async () => {
        try {
            const res = await api.get("/folders");
            setFolders(res.data);
        } catch (error) {
            console.log("Error fetching folders", error);
        }
    };
    const fetchTags = async () => {
        try {
            const res = await api.get("/notes/tags");
            setTags(res.data);
        } catch (error) {
            console.log("Error fetching tags", error);
        }
    };
    // reload notes whenever a filter or the page changes
    useEffect(() => {
        fetchNotes();
    }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        fetchFolders();
        fetchTags();
    }, []);
    // changing any filter goes back to page 1
    const updateFilters = (changes) => setFilters({ ...filters, ...changes, page: 1 });
    const handleFoldersChanged = () => {
        fetchFolders();
        fetchTags();
        fetchNotes();
    };
    // after a note is pinned or deleted, reload so order, counts and pages stay right
    const handleNoteChanged = () => {
        fetchNotes();
        fetchTags();
    };
    return (
        <div className="min-h-screen">
            {isRateLimited && <RateLimitedUI />}
            <div className="max-w-7xl mx-auto p-4 mt-6 grid gap-6 lg:grid-cols-[auto_1fr]">
                <FolderSidebar
                    folders={folders}
                    selected={filters.folder}
                    onSelect={(folder) => updateFilters({ folder })}
                    onFoldersChanged={handleFoldersChanged}
                />
                <main>
                    <NoteFilters filters={filters} tags={tags} onChange={updateFilters} />
                    {loading && <div className="text-center text-primary py-10">Loading notes...</div>}
                    {!loading && notes.length === 0 && !isRateLimited && (
                        <div className="flex justify-center py-10">
                            <div className="w-full max-w-sm">
                                <NewNoteCard message="You have no notes here" />
                            </div>
                        </div>
                    )}

                    {notes.length > 0 && !isRateLimited && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {/* "New Note" box, always the first box in the grid */}
                            <NewNoteCard />
                            {notes.map((note) => (
                                <NoteCard key={note._id} note={note} onChanged={handleNoteChanged} />
                            ))}
                        </div>
                    )}
                    <Pagination
                        page={filters.page}
                        totalPages={totalPages}
                        onPageChange={(page) => setFilters({ ...filters, page })}
                    />
                </main>
            </div>
        </div>
    );
};
export default HomePage;