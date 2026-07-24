import { useState } from "react";

function TagInput({
    label,
    required = false,
    placeholder = "Type a skill and press Enter",
    value = [],
    onChange,
    maxTags = 15,
}) {
    const [input, setInput] = useState("");

    const addTag = () => {
        const tag = input.trim();

        if (!tag) return;

        if (value.includes(tag)) {
            setInput("");
            return;
        }

        if (value.length >= maxTags) return;

        onChange([...value, tag]);
        setInput("");
    };

    const removeTag = (index) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }

        if (
            e.key === "Backspace" &&
            input === "" &&
            value.length > 0
        ) {
            removeTag(value.length - 1);
        }
    };

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <div className="flex min-h-[56px] flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-[#111827] p-3 transition-all duration-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">

                {value.map((tag, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-blue-600/20 px-3 py-1 text-sm text-blue-300"
                    >
                        {tag}

                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-blue-300 transition hover:text-red-400 hover:cursor-pointer"
                        >
                            ×
                        </button>
                    </div>
                ))}

                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none"
                />

            </div>

            <p className="mt-2 text-xs text-gray-500">
                Press Enter or comma to add a skill.
            </p>

        </div>
    );
}

export default TagInput;