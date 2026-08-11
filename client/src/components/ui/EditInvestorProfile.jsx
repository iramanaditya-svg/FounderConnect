import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import TagInput from "../ui/TagInput";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";

import {
    getInvestorProfile,
    updateInvestorProfile,
    createInvestorProfile,
} from "../../services/api/investor.service";

import {
    updateProfilePicture,
} from "../../services/api/profileManagement.service";

function EditInvestorProfile() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        preferredIndustries: [],
        preferredStages: [],
        bio: "",
        linkedin: "",
        website: "",
        portfolio: "",
    });

    const [profilePicture, setProfilePicture] =
        useState("");

    const [photoChanged, setPhotoChanged] =
        useState(false);

    const [profileExists, setProfileExists] =
        useState(true);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getInvestorProfile();

                const profile =
                    response?.data ||
                    response?.investorProfile ||
                    response;

                if (
                    profile &&
                    typeof profile === "object" &&
                    !Array.isArray(profile)
                ) {
                    setFormData({
                        preferredIndustries:
                            profile.preferredIndustries ||
                            [],

                        preferredStages:
                            profile.preferredStages ||
                            [],

                        bio:
                            profile.bio ||
                            "",

                        linkedin:
                            profile.linkedin ||
                            "",

                        website:
                            profile.website ||
                            "",

                        portfolio:
                            profile.portfolio ||
                            "",
                    });

                    setProfileExists(true);
                }

                const user =
                    JSON.parse(
                        localStorage.getItem("user")
                    );

                if (user?.profilePicture) {
                    setProfilePicture(
                        user.profilePicture
                    );
                }
            } catch (error) {
                console.error(
                    "Investor profile error:",
                    error
                );

                if (
                    error.response?.status === 404
                ) {
                    setProfileExists(false);

                    setFormData({
                        preferredIndustries: [],
                        preferredStages: [],
                        bio: "",
                        linkedin: "",
                        website: "",
                        portfolio: "",
                    });
                } else {
                    setError(
                        error.response?.data?.message ||
                        "Failed to load investor profile."
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleProfilePicture = (e) => {
        const file =
            e.target.files?.[0];

        if (!file) return;

        if (
            !file.type.startsWith("image/")
        ) {
            alert(
                "Please select a valid image."
            );

            e.target.value = "";

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "Profile picture must be smaller than 5 MB."
            );

            e.target.value = "";

            return;
        }

        const reader =
            new FileReader();

        reader.onload = () => {
            const image =
                new Image();

            image.onload = () => {
                const canvas =
                    document.createElement(
                        "canvas"
                    );

                const size = 300;

                canvas.width = size;
                canvas.height = size;

                const context =
                    canvas.getContext(
                        "2d"
                    );

                const scale =
                    Math.max(
                        size / image.width,
                        size / image.height
                    );

                const width =
                    image.width * scale;

                const height =
                    image.height * scale;

                const x =
                    (size - width) / 2;

                const y =
                    (size - height) / 2;

                context.drawImage(
                    image,
                    x,
                    y,
                    width,
                    height
                );

                const compressedImage =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.8
                    );

                setProfilePicture(
                    compressedImage
                );

                setPhotoChanged(true);
            };

            image.src =
                reader.result;
        };

        reader.readAsDataURL(file);
    };

    const removeProfilePicture = () => {
        setProfilePicture("");
        setPhotoChanged(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.bio.trim()) {
            setError(
                "Bio is required."
            );

            return;
        }

        try {
            setSaving(true);
            setError("");

            if (profileExists) {
                await updateInvestorProfile(
                    formData
                );
            } else {
                await createInvestorProfile(
                    formData
                );
            }

            if (photoChanged) {
                const response =
                    await updateProfilePicture(
                        profilePicture
                    );

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                user.profilePicture =
                    response?.data
                        ?.profilePicture ||
                    profilePicture;

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            alert(
                "Investor profile saved successfully."
            );

            navigate(
                "/investor/dashboard",
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(
                "Save investor profile error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to save investor profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-emerald-500" />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading profile...
                    </p>

                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 25,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.5,
            }}
            className="mx-auto w-full max-w-6xl"
        >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

                <div className="text-center">

                    <h1 className="text-4xl font-bold text-white">
                        Edit Your Profile
                    </h1>

                    <p className="mt-4 text-lg text-gray-400">
                        Update your investor profile and investment preferences.
                    </p>

                </div>

                {error && (
                    <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="mt-10"
                >

                    <div className="flex flex-col items-center">

                        <label className="relative cursor-pointer">

                            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-emerald-500/50 bg-[#111827] transition-all duration-300 hover:scale-105 hover:border-emerald-400">

                                {profilePicture ? (
                                    <img
                                        src={
                                            profilePicture
                                        }
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-5xl text-emerald-400">
                                        +
                                    </span>
                                )}

                            </div>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg"
                                onChange={
                                    handleProfilePicture
                                }
                                className="hidden"
                            />

                        </label>

                        <p className="mt-4 text-sm font-medium text-white">
                            {profilePicture
                                ? "Change Profile Photo"
                                : "Upload Profile Photo"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG • Max 5 MB
                        </p>

                        {profilePicture && (
                            <button
                                type="button"
                                onClick={
                                    removeProfilePicture
                                }
                                className="mt-3 text-xs font-medium text-red-400 transition hover:text-red-300"
                            >
                                Remove Photo
                            </button>
                        )}

                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                        <TagInput
                            label="Preferred Industries"
                            placeholder="Type an industry and press Enter"
                            value={
                                formData.preferredIndustries
                            }
                            onChange={
                                (industries) =>
                                    setFormData({
                                        ...formData,
                                        preferredIndustries:
                                            industries,
                                    })
                            }
                        />

                        <TagInput
                            label="Preferred Stages"
                            placeholder="idea, seed, series_a..."
                            value={
                                formData.preferredStages
                            }
                            onChange={
                                (stages) =>
                                    setFormData({
                                        ...formData,
                                        preferredStages:
                                            stages,
                                    })
                            }
                        />

                    </div>

                    <div className="mt-8">

                        <TextAreaField
                            label="Bio"
                            required
                            rows={6}
                            placeholder="Tell startups about your investment interests..."
                            value={
                                formData.bio
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bio: e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <h2 className="text-2xl font-semibold text-white">
                        Professional Links

                        <span className="ml-2 text-sm font-normal text-gray-500">
                            (Optional)
                        </span>
                    </h2>

                    <div className="mt-6 space-y-6">

                        <InputField
                            label="LinkedIn"
                            placeholder="https://linkedin.com/in/username"
                            value={
                                formData.linkedin
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    linkedin:
                                        e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Website"
                            placeholder="https://yourwebsite.com"
                            value={
                                formData.website
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    website:
                                        e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Portfolio"
                            placeholder="https://yourportfolio.com"
                            value={
                                formData.portfolio
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    portfolio:
                                        e.target.value,
                                })
                            }
                        />

                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <div className="flex items-center justify-between border-t border-white/10 pt-8">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/investor/dashboard"
                                )
                            }
                            className="rounded-xl border border-white/10 px-8 py-3 font-medium text-gray-400 transition hover:bg-white/5 hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-10 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : profileExists
                                ? "Save Changes →"
                                : "Create Profile →"}
                        </button>

                    </div>

                </form>

            </div>
        </motion.div>
    );
}

export default EditInvestorProfile;