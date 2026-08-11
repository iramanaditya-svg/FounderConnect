import { motion } from "framer-motion";
import {
    useState,
    useEffect,
} from "react";
import {
    useNavigate,
    useLocation,
} from "react-router-dom";

import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";

import {
    createStartupBuilderProfile,
    getStartupBuilderProfile,
    updateStartupBuilderProfile,
} from "../../services/api/startupBuilder.service";

import {
    updateProfilePicture,
} from "../../services/api/profileManagement.service";

function StartupBuilderForm({
    mode = "create",
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        headline: "",
        experience: "",
        location: "",
        bio: "",
        linkedin: "",
        website: "",
    });

    const [profilePicture, setProfilePicture] =
        useState("");

    const [photoChanged, setPhotoChanged] =
        useState(false);

    const [errors, setErrors] = useState({});

    const [loadingProfile, setLoadingProfile] =
        useState(mode === "edit");

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (user?.profilePicture) {
            setProfilePicture(
                user.profilePicture
            );
        }
    }, []);

    useEffect(() => {
        if (mode !== "edit") {
            setLoadingProfile(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                setLoadingProfile(true);

                const response =
                    await getStartupBuilderProfile();

                const profile =
                    response?.data
                        ?.startupBuilderProfile ||
                    response?.data?.data
                        ?.startupBuilderProfile ||
                    response?.startupBuilderProfile ||
                    response?.data;

                if (!profile) {
                    throw new Error(
                        "Startup Builder profile data not found."
                    );
                }

                setFormData({
                    headline:
                        profile.headline ?? "",

                    experience:
                        profile.experience ?? "",

                    location:
                        profile.location ?? "",

                    bio:
                        profile.bio ?? "",

                    linkedin:
                        profile.linkedin ?? "",

                    website:
                        profile.website ?? "",
                });
            } catch (error) {
                console.error(
                    "Failed to load Startup Builder profile:",
                    error
                );

                alert(
                    error.response?.data
                        ?.message ||
                        "Failed to load profile."
                );
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [mode]);

    const handleProfilePicture = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
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

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const canvas =
                    document.createElement(
                        "canvas"
                    );

                const size = 300;

                canvas.width = size;
                canvas.height = size;

                const context =
                    canvas.getContext("2d");

                const scale = Math.max(
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

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    };

    const removeProfilePicture = () => {
        setProfilePicture("");
        setPhotoChanged(true);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.headline.trim()) {
            newErrors.headline =
                "Headline is required.";
        }

        if (!formData.location.trim()) {
            newErrors.location =
                "Location is required.";
        }

        if (!formData.bio.trim()) {
            newErrors.bio =
                "Bio is required.";
        }

        setErrors(newErrors);

        return (
            Object.keys(newErrors)
                .length === 0
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            if (mode === "edit") {
                await updateStartupBuilderProfile(
                    formData
                );

                if (photoChanged) {
                    const photoResponse =
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
                        photoResponse.data
                            ?.profilePicture ||
                        profilePicture;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }

                alert(
                    "Profile updated successfully."
                );
            } else {
                await createStartupBuilderProfile(
                    formData
                );

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                if (profilePicture) {
                    const photoResponse =
                        await updateProfilePicture(
                            profilePicture
                        );

                    user.profilePicture =
                        photoResponse.data
                            ?.profilePicture ||
                        profilePicture;
                }

                user.isProfileCompleted =
                    true;

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );
            }

            const returnTo =
                location.state?.returnTo;

            if (returnTo) {
                navigate(
                    returnTo,
                    {
                        state:
                            location.state,
                        replace: true,
                    }
                );
            } else {
                const user =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                navigate(
                    `/${user.activeRole}/dashboard`,
                    {
                        replace: true,
                    }
                );
            }
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data
                    ?.message ||
                    "Something went wrong."
            );
        }
    };

    if (loadingProfile) {
        return (
            <div className="flex min-h-[600px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />

                    <p className="mt-4 text-sm text-slate-400">
                        Loading your profile...
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
            className="mx-auto mt-16 w-full max-w-6xl"
        >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

                <div className="text-center">

                    <h1 className="text-4xl font-bold text-white">
                        {mode === "edit"
                            ? "Edit Profile"
                            : "Complete Your Profile"}
                    </h1>

                    <p className="mt-4 text-lg text-gray-400">
                        {mode === "edit"
                            ? "Update your Startup Builder profile."
                            : "Build your Startup Builder profile and connect with founders, investors and professionals."}
                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="mt-10 flex flex-col items-center">

                        <label className="relative cursor-pointer">

                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-blue-500/50 bg-[#111827] transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-[#1b2435]">

                                {profilePicture ? (
                                    <img
                                        src={
                                            profilePicture
                                        }
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-blue-400">
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

                    <div className="grid grid-cols-2 gap-8">

                        <div className="space-y-6">

                            <div>

                                <InputField
                                    label="Headline"
                                    required
                                    placeholder="Building AI startups solving healthcare problems"
                                    value={
                                        formData.headline
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            headline:
                                                e.target.value,
                                        })
                                    }
                                />

                                {errors.headline && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {
                                            errors.headline
                                        }
                                    </p>
                                )}

                            </div>

                            <div>

                                <InputField
                                    label="Location"
                                    required
                                    placeholder="Bengaluru, India"
                                    value={
                                        formData.location
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            location:
                                                e.target.value,
                                        })
                                    }
                                />

                                {errors.location && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {
                                            errors.location
                                        }
                                    </p>
                                )}

                            </div>

                        </div>

                        <div className="space-y-6">

                            <SelectField
                                label="Experience"
                                value={
                                    formData.experience
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        experience:
                                            e.target.value,
                                    })
                                }
                                options={[
                                    "Student",
                                    "Fresher",
                                    "0 - 2 Years",
                                    "2 - 5 Years",
                                    "5+ Years",
                                ]}
                            />

                            <div>

                                <TextAreaField
                                    label="Bio"
                                    required
                                    rows={5}
                                    placeholder="Tell people about yourself, your entrepreneurial journey and what kind of startups you love building..."
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

                                {errors.bio && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {
                                            errors.bio
                                        }
                                    </p>
                                )}

                            </div>

                        </div>

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

                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">

                        {mode === "create" && (
                            <div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        const user =
                                            JSON.parse(
                                                localStorage.getItem(
                                                    "user"
                                                )
                                            );

                                        navigate(
                                            `/${user.activeRole}/dashboard`
                                        );
                                    }}
                                    className="text-sm font-medium text-gray-400 transition duration-300 hover:cursor-pointer hover:text-white"
                                >
                                    Skip for now
                                </button>

                                <p className="mt-2 max-w-xs text-xs text-gray-500">
                                    You can complete your profile later from your dashboard before creating or managing your startups.
                                </p>

                            </div>
                        )}

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            {mode === "edit"
                                ? "Save Changes"
                                : "Complete Profile →"}
                        </button>

                    </div>

                </form>

            </div>
        </motion.div>
    );
}

export default StartupBuilderForm;