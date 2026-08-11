import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TagInput from "../ui/TagInput";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";

import { createInvestorProfile } from "../../services/api/investor.service";
import { updateProfilePicture } from "../../services/api/profileManagement.service";

function InvestorForm() {
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

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.bio.trim()) {
            newErrors.bio = "Bio is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleProfilePicture = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            e.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Profile picture must be smaller than 5 MB.");
            e.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const image = new Image();

            image.onload = () => {
                const canvas =
                    document.createElement("canvas");

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
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    };

    const removeProfilePicture = () => {
        setProfilePicture("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response =
                await createInvestorProfile(
                    formData
                );

            if (profilePicture) {
                await updateProfilePicture(
                    profilePicture
                );
            }

            console.log(response);

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            user.isProfileCompleted = true;

            if (profilePicture) {
                user.profilePicture =
                    profilePicture;
            }

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            navigate(
                `/${user.activeRole}/dashboard`,
                {
                    replace: true,
                }
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to create investor profile."
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
                        Complete Your Profile
                    </h1>

                    <p className="mt-4 text-lg text-gray-400">
                        Build your investor profile and discover promising startups.
                    </p>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="mt-10 flex flex-col items-center">

                        <label className="relative cursor-pointer">

                            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-emerald-500/50 bg-[#111827] transition-all duration-300 hover:scale-105 hover:border-emerald-400 hover:bg-[#1b2435]">

                                {profilePicture ? (
                                    <img
                                        src={profilePicture}
                                        alt="Profile preview"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl text-emerald-400">
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

                        </div>

                        <div className="space-y-6">

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

                    </div>

                    <div className="mt-8">

                        <TextAreaField
                            label="Bio"
                            required
                            rows={5}
                            placeholder="Tell startups about your investment interests..."
                            value={formData.bio}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    bio: e.target.value,
                                })
                            }
                        />

                        {errors.bio && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.bio}
                            </p>
                        )}

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

                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">

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
                                You can complete your profile later from your dashboard before exploring startup investment opportunities.
                            </p>

                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-10 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:shadow-lg hover:shadow-emerald-500/30"
                        >
                            Complete Profile →
                        </button>

                    </div>

                </form>

            </div>
        </motion.div>
    );
}

export default InvestorForm;