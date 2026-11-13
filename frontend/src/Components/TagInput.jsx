import { useState } from "react";
import { XIcon } from "lucide-react";

// type a tag and press Enter (or a comma) to add it; click x to remove it
const TagInput = ({ tags, setTags }) => {
    const [text, setText] = useState("");
    const addTag = () => {
        const tag = text.trim().toLowerCase();
        if (tag && !tags.includes(tag) && tags.length < 10) {
            setTags([...tags, tag]);
        }
        setText("");
    };
    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault(); // stop Enter from submitting the form
            addTag();
        }
    };
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                    <span key={tag} className="badge badge-primary badge-outline gap-1">
                        #{tag}
                        <button type="button" onClick={() => setTags(tags.filter((t) => t !== tag))}>
                            <XIcon className="size-3" />
                        </button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Add a tag and press Enter"
                value={text}
                maxLength={20}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
            />
        </div>
    );
};
export default TagInput;