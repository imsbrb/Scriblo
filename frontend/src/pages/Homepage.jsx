import { useEffect, useState } from "react";
import RateLimitedUI from "../Components/RateLimitingUI";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NoteCard from "../Components/NoteCard";
import NotesNotFound from "../Components/NotesNotFound";
import FolderSidebar from "../Components/FolderSidebar";
const HomePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchNotes = async () => {
        try {
            const res = await api.get("/notes");
            setNotes(Array.isArray(res.data) ? res.data : res.data.notes);
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
    useEffect(() => {
        fetchNotes();
        fetchFolders();
    }, []);
    // deleting a folder deletes its notes too, so reload both lists
    const handleFoldersChanged = () => {
        fetchFolders();
        fetchNotes();
    };
    return (
        <div className="min-h-screen">
            {isRateLimited && <RateLimitedUI />}
            <div className="max-w-7xl mx-auto p-4 mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
                <FolderSidebar folders={folders} onFoldersChanged={handleFoldersChanged} />
                <main>
                    {loading && <div className="text-center text-primary py-10">Loading notes...</div>}
                    {!loading && notes.length === 0 && !isRateLimited && <NotesNotFound />}
                    {notes.length > 0 && !isRateLimited && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {notes.map((note) => (
                                <NoteCard key={note._id} note={note} setNotes={setNotes} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
export default HomePage;