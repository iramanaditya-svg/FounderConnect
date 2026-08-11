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
import TagInput from "../ui/TagInput";
import SelectField from "../ui/SelectField";

import {
    createProfessionalProfile,
    getProfessionalProfile,
    updateProfessionalProfile,
} from "../../services/api/professional.service";

import {
    updateProfilePicture,
} from "../../services/api/profileManagement.service";

function ProfessionalForm({
    mode = "create",
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        headline: "",
        skills: [],
        experience: "",
        education: {
            college: "",
            degree: "",
            branch: "",
            graduationYear: "",
        },
        resume: "",
        github: "",
        linkedin: "",
        portfolio: "",
    });

    const [profilePicture, setProfilePicture] =
        useState("");

    const [photoChanged, setPhotoChanged] =
        useState(false);

    const [errors, setErrors] = useState({});

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
        if (mode !== "edit") return;

        const fetchProfile = async () => {
            try {
                const response =
                    await getProfessionalProfile();

                const profile =
                    response.data
                        .professionalProfile;

                setFormData({
                    headline:
                        profile.headline || "",

                    skills:
                        profile.skills || [],

                    experience:
                        profile.experience || "",

                    education: {
                        college:
                            profile.education
                                ?.college || "",

                        degree:
                            profile.education
                                ?.degree || "",

                        branch:
                            profile.education
                                ?.branch || "",

                        graduationYear:
                            profile.education
                                ?.graduationYear || "",
                    },

                    resume:
                        profile.resume || "",

                    github:
                        profile.github || "",

                    linkedin:
                        profile.linkedin || "",

                    portfolio:
                        profile.portfolio || "",
                });
            } catch (error) {
                console.log(error);
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

        if (formData.skills.length === 0) {
            newErrors.skills =
                "Please add at least one skill.";
        }

        if (!formData.experience) {
            newErrors.experience =
                "Please select your experience.";
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
                await updateProfessionalProfile(
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
                await createProfessionalProfile(
                    formData
                );

                if (profilePicture) {
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

                    user.isProfileCompleted =
                        true;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                } else {
                    const user =
                        JSON.parse(
                            localStorage.getItem(
                                "user"
                            )
                        );

                    user.isProfileCompleted =
                        true;

                    localStorage.setItem(
                        "user",
                        JSON.stringify(user)
                    );
                }
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
                const updatedUser =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                navigate(
                    `/${updatedUser.activeRole}/dashboard`,
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

                    <p className="mt-4 text-gray-400">
                        {mode === "edit"
                            ? "Keep your profile updated to improve your opportunities."
                            : "Build a profile that helps founders discover your talent."}
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

                            <InputField
                                label="Headline"
                                required
                                placeholder="Frontend Developer | React"
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

                            <TagInput
                                label="Skills"
                                required
                                value={
                                    formData.skills
                                }
                                onChange={
                                    (newSkills) =>
                                        setFormData({
                                            ...formData,
                                            skills:
                                                newSkills,
                                        })
                                }
                            />

                            {errors.skills && (
                                <p className="mt-2 text-sm text-red-500">
                                    {
                                        errors.skills
                                    }
                                </p>
                            )}

                        </div>

                        <div className="space-y-6">

                            <SelectField
                                label="Experience"
                                required
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

                            {errors.experience && (
                                <p className="mt-2 text-sm text-red-500">
                                    {
                                        errors.experience
                                    }
                                </p>
                            )}

                        </div>

                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <h2 className="text-2xl font-semibold text-white">
                        Education
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            (Optional)
                        </span>
                    </h2>

                    <div className="mt-6 grid grid-cols-2 gap-6">

                        <InputField
                            label="College / University"
                            placeholder="IIT Dhanbad"
                            value={
                                formData.education
                                    .college
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    education: {
                                        ...formData.education,
                                        college:
                                            e.target.value,
                                    },
                                })
                            }
                        />

                        <InputField
                            label="Degree"
                            placeholder="B.Tech"
                            value={
                                formData.education
                                    .degree
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    education: {
                                        ...formData.education,
                                        degree:
                                            e.target.value,
                                    },
                                })
                            }
                        />

                        <InputField
                            label="Branch"
                            placeholder="Electronics & Communication Engineering"
                            value={
                                formData.education
                                    .branch
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    education: {
                                        ...formData.education,
                                        branch:
                                            e.target.value,
                                    },
                                })
                            }
                        />

                        <InputField
                            label="Graduation Year"
                            type="number"
                            placeholder="2030"
                            value={
                                formData.education
                                    .graduationYear
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    education: {
                                        ...formData.education,
                                        graduationYear:
                                            e.target.value,
                                    },
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
                            label="GitHub"
                            placeholder="https://github.com/username"
                            value={
                                formData.github
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    github:
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

                    <h2 className="text-2xl font-semibold text-white">
                        Resume
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            (Optional)
                        </span>
                    </h2>

                    <div className="mt-6">

                        <InputField
                            label="Resume Link"
                            placeholder="https://drive.google.com/file/..."
                            value={
                                formData.resume
                            }
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    resume:
                                        e.target.value,
                                })
                            }
                        />

                        <p className="mt-2 text-sm text-slate-500">
                            Paste a public Google Drive, Dropbox or OneDrive PDF link.
                        </p>

                        {formData.resume && (
                            <a
                                href={
                                    formData.resume
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-block font-medium text-cyan-400 hover:underline"
                            >
                                View Current Resume ↗
                            </a>
                        )}

                    </div>

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
                                    className="text-sm font-medium text-gray-400 transition hover:cursor-pointer hover:text-white"
                                >
                                    Skip for now
                                </button>

                                <p className="mt-2 max-w-xs text-xs text-gray-500">
                                    You can complete your profile later from your dashboard before applying to any startup.
                                </p>

                            </div>
                        )}

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-3 text-lg font-semibold text-white transition duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-lg hover:shadow-blue-500/30"
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

export default ProfessionalForm;