import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    changeCurrentPassword,
} from "../../services/api/user.service";

function PasswordInput({
    name,
    value,
    placeholder,
    show,
    setShow,
    onChange,
}) {
    return (
        <div className="relative">
            <input
                type={show ? "text" : "password"}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-white/10 bg-[#111827] px-4 py-4 pr-12 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500"
            />

            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
            >
                {show ? (
                    <EyeOff size={20} />
                ) : (
                    <Eye size={20} />
                )}
            </button>
        </div>
    );
}

function ChangePassword() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError(
                "New password must be at least 8 characters long."
            );
            return;
        }

        if (
            formData.newPassword ===
            formData.currentPassword
        ) {
            setError(
                "New password must be different from your current password."
            );
            return;
        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {
            setError(
                "New password and confirm password do not match."
            );
            return;
        }

        try {
            setLoading(true);

await changeCurrentPassword(
    formData.currentPassword,
    formData.newPassword,
    formData.confirmPassword
);
            setSuccess(
                "Password changed successfully."
            );

            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to change password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="rounded-3xl border border-white/10 bg-[#0F172A] p-8 shadow-2xl md:p-10">

                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600">
                        <LockKeyhole
                            size={30}
                            className="text-white"
                        />
                    </div>

                    <h1 className="mt-6 text-3xl font-bold text-white">
                        Change Password
                    </h1>

                    <p className="mt-3 text-slate-400">
                        Update your password to keep your account secure.
                    </p>
                </div>

                {error && (
                    <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                        {success}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Current Password
                        </label>

                        <PasswordInput
                            name="currentPassword"
                            value={formData.currentPassword}
                            placeholder="Enter current password"
                            show={showCurrent}
                            setShow={setShowCurrent}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            New Password
                        </label>

                        <PasswordInput
                            name="newPassword"
                            value={formData.newPassword}
                            placeholder="Enter new password"
                            show={showNew}
                            setShow={setShowNew}
                            onChange={handleChange}
                        />

                        <p className="mt-2 text-xs text-slate-500">
                            Password must contain at least 8 characters.
                        </p>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-300">
                            Confirm New Password
                        </label>

                        <PasswordInput
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Confirm new password"
                            show={showConfirm}
                            setShow={setShowConfirm}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="rounded-xl border border-white/10 px-6 py-3 font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3 font-semibold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading
                                ? "Updating..."
                                : "Change Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;