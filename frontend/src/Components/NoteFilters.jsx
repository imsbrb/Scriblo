import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
// search box + tag / pinned / sort dropdowns. Calls onChange({ field: value }).
const NoteFilters = ({ filters, tags, onChange }) => {
    const [searchText, setSearchText] = useState(filters.search);
    // wait until the user stops typing for 400 ms before searching
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchText !== filters.search) onChange({ search: searchText });
        }, 400);
        return () => clearTimeout(timer);
    }, [searchText]); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="flex flex-col md:flex-row gap-2 mb-6">
            <label className="input input-bordered flex items-center gap-2 grow">
                <SearchIcon className="size-4 opacity-60" />
                <input
                    type="text"
                    className="grow"
                    placeholder="Search titles and content..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </label>
            <select className="select select-bordered" value={filters.tag} onChange={(e) => onChange({
                tag: e.target.value
            })}>
                <option value="">All tags</option>
                {tags.map((tag) => (
                    <option key={tag} value={tag}>#{tag}</option>
                ))}
            </select>
            <select className="select select-bordered" value={filters.pinned} onChange={(e) =>
                onChange({ pinned: e.target.value })}>
                <option value="">Pinned + unpinned</option>
                <option value="true">Pinned only</option>
                <option value="false">Unpinned only</option>
            </select>
            <select className="select select-bordered" value={filters.sort} onChange={(e) =>
                onChange({ sort: e.target.value })}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
            </select>
        </div>
    );
};
export default NoteFilters;