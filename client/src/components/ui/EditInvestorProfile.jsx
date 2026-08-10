import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import TagInput from "../ui/TagInput";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";

import {
    getInvestorProfile,
    updateInvestorProfile,
} from "../../services/api/investor.service";

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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response =
                    await getInvestorProfile();

                const profile =
                    response?.data;

                setFormData({
                    preferredIndustries:
                        profile?.preferredIndustries ||
                        [],
                    preferredStages:
                        profile?.preferredStages ||
                        [],
                    bio:
                        profile?.bio ||
                        "",
                    linkedin:
                        profile?.linkedin ||
                        "",
                    website:
                        profile?.website ||
                        "",
                    portfolio:
                        profile?.portfolio ||
                        "",
                });
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data?.message ||
                    "Failed to load investor profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.bio.trim()) {
            setError("Bio is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            await updateInvestorProfile(
                formData
            );

            navigate(
                "/investor/dashboard"
            );
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to update investor profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-slate-400">
                    Loading profile...
                </p>
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

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                        <div>

                            <TagInput
                                label="Preferred Industries"
                                placeholder="Type an industry and press Enter"
                                value={
                                    formData.preferredIndustries
                                }
                                onChange={(
                                    industries
                                ) =>
                                    setFormData({
                                        ...formData,
                                        preferredIndustries:
                                            industries,
                                    })
                                }
                            />

                        </div>

                        <div>

                            <TagInput
                                label="Preferred Stages"
                                placeholder="idea, seed, series_a..."
                                value={
                                    formData.preferredStages
                                }
                                onChange={(
                                    stages
                                ) =>
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
                            className="text-sm font-medium text-gray-400 transition hover:text-white"
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
                                : "Save Changes →"}
                        </button>

                    </div>

                </form>

            </div>
        </motion.div>
    );
}

export default EditInvestorProfile;