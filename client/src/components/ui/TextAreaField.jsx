function TextAreaField({
    label,
    required = false,
    placeholder = "",
    value,
    onChange,
    rows = 5,
}) {
    return (
        <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-300">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">*</span>
                )}
            </label>

            <textarea
                rows={rows}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
        </div>
    );
}

export default TextAreaField;