import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";

import { createStartupBuilderProfile } from "../../services/api/startupBuilder.service";

function StartupBuilderForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        headline: "",
        experience: "",
        location: "",
        bio: "",
        linkedin: "",
        website: "",
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.headline.trim()) {
            newErrors.headline = "Headline is required.";
        }

        if (!formData.location.trim()) {
            newErrors.location = "Location is required.";
        }

        if (!formData.bio.trim()) {
            newErrors.bio = "Bio is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await createStartupBuilderProfile(formData);

            console.log(response);

            // navigate("/startup-builder/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-16 w-full max-w-6xl"
        >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white">
                        Complete Your Profile
                    </h1>

                    <p className="mt-4 text-lg text-gray-400">
                        Build your Startup Builder profile and connect with founders,
                        investors and professionals.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mt-10 flex flex-col items-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-blue-500/50 bg-[#111827] transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:bg-[#1b2435] hover:cursor-pointer">
                            <span className="text-4xl text-blue-400">
                                +
                            </span>
                        </div>

                        <p className="mt-4 text-sm font-medium text-white">
                            Upload Profile Photo
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG • Max 5 MB
                        </p>
                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <InputField
                                    label="Headline"
                                    required
                                    placeholder="Building AI startups solving healthcare problems"
                                    value={formData.headline}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            headline: e.target.value,
                                        })
                                    }
                                />

                                {errors.headline && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.headline}
                                    </p>
                                )}
                            </div>

                            <div>
                                <InputField
                                    label="Location"
                                    required
                                    placeholder="Bengaluru, India"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            location: e.target.value,
                                        })
                                    }
                                />

                                {errors.location && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.location}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <SelectField
                                label="Experience"
                                value={formData.experience}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        experience: e.target.value,
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
                            value={formData.linkedin}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    linkedin: e.target.value,
                                })
                            }
                        />

                        <InputField
                            label="Website"
                            placeholder="https://yourwebsite.com"
                            value={formData.website}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    website: e.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="my-10 h-px bg-white/10" />

                    <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
                        <div>
                            <button
                                type="button"
                                className="text-sm font-medium text-gray-400 transition duration-300 hover:text-white hover:cursor-pointer"
                            >
                                Skip for now
                            </button>

                            <p className="mt-2 max-w-xs text-xs text-gray-500">
                                You can complete your profile later from your dashboard before creating or managing your startups.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-10 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 hover:cursor-pointer"
                        >
                            Complete Profile →
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}

export default StartupBuilderForm;