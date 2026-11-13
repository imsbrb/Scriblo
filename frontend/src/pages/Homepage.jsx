import { useEffect, useState } from "react";
import RateLimitedUI from "../Components/RateLimitingUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../Components/NoteCard";
import NotesNotFound from "../Components/NotesNotFound";
import FolderSidebar from "../Components/FolderSidebar";
import NoteFilters from "../Components/NoteFilters";
import Pagination from "../Components/Pagination";
const emptyFilters = { search: "", folder: "", tag: "", pinned: "", sort: "newest", page: 1 };
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
    const filtersActive = filters.search || filters.folder || filters.tag || filters.pinned;
    return (
        <div className="min-h-screen">
            {isRateLimited && <RateLimitedUI />}
            <div className="max-w-7xl mx-auto p-4 mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
                <FolderSidebar
                    folders={folders}
                    selected={filters.folder}
                    onSelect={(folder) => updateFilters({ folder })}
                    onFoldersChanged={handleFoldersChanged}
                />
                <main>
                    <NoteFilters filters={filters} tags={tags} onChange={updateFilters} />
                    {loading && <div className="text-center text-primary py-10">Loading notes...</div>}
                    {!loading && notes.length === 0 && !isRateLimited && !filtersActive && <NotesNotFound
                    />}
                    {!loading && notes.length === 0 && !isRateLimited && filtersActive && (
                        <div className="text-center py-16 space-y-4">
                            <p className="text-base-content/70">No notes match these filters.</p>
                            <button className="btn btn-outline btn-sm" onClick={() =>
                                setFilters(emptyFilters)}>
                                Clear filters
                            </button>
                        </div>
                    )}
                    {notes.length > 0 && !isRateLimited && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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