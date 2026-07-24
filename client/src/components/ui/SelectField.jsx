function SelectField({
    label,
    required = false,
    value,
    onChange,
    options = [],
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <select
                value={value}
                onChange={onChange}
                className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#111827]
                    px-4
                    py-3
                    text-white
                    outline-none
                    transition-all
                    duration-300
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/20
                "
            >
                <option value="">
                    Select Experience
                </option>

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default SelectField;