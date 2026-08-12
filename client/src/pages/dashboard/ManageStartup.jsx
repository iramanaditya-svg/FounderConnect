import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api/api";

import InputField from "../../components/ui/InputField";
import TextAreaField from "../../components/ui/TextAreaField";
import SelectField from "../../components/ui/SelectField";
import TagInput from "../../components/ui/TagInput";

function ManageStartup() {
    const { startupId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        tagline: "",
        description: "",
        industry: [],
        stage: "",
        website: "",
        location: "",
        logo: "",
        coverImage: "",
        pitchDeck: "",
        openToInvestors: false,
        currentValuation: "",
        fundingGoal: "",
        equityOffered: "",
    });

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    const fetchStartup = async () => {
        try {
            setLoading(true);

            const response =
                await api.get(
                    `/startups/${startupId}`,
                    {
                        withCredentials: true,
                    }
                );

            const startup =
                response.data?.data?.startup ||
                response.data?.startup ||
                response.data?.data;

            if (!startup) {
                throw new Error(
                    "Startup data not found."
                );
            }

            setFormData({
                name: startup.name ?? "",
                tagline: startup.tagline ?? "",
                description:
                    startup.description ?? "",
                industry: Array.isArray(
                    startup.industry
                )
                    ? startup.industry
                    : startup.industry
                    ? [startup.industry]
                    : [],
                stage: startup.stage ?? "",
                website: startup.website ?? "",
                location: startup.location ?? "",
                logo: startup.logo ?? "",
                coverImage:
                    startup.coverImage ?? "",
                pitchDeck:
                    startup.pitchDeck ?? "",
                openToInvestors:
                    startup.openToInvestors ??
                    false,
                currentValuation:
                    startup.currentValuation ??
                    "",
                fundingGoal:
                    startup.fundingGoal ?? "",
                equityOffered:
                    startup.equityOffered ?? "",
            });
        } catch (error) {
            console.error(
                "Failed to load startup:",
                error
            );

            alert(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to load startup."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response =
                await api.patch(
                    `/startups/${startupId}`,
                    formData,
                    {
                        withCredentials: true,
                    }
                );

            const updatedStartup =
                response.data?.data?.startup ||
                response.data?.startup ||
                response.data?.data;

            if (updatedStartup) {
                setFormData({
                    name:
                        updatedStartup.name ??
                        "",
                    tagline:
                        updatedStartup.tagline ??
                        "",
                    description:
                        updatedStartup.description ??
                        "",
                    industry:
                        Array.isArray(
                            updatedStartup.industry
                        )
                            ? updatedStartup.industry
                            : updatedStartup.industry
                            ? [
                                  updatedStartup.industry,
                              ]
                            : [],
                    stage:
                        updatedStartup.stage ??
                        "",
                    website:
                        updatedStartup.website ??
                        "",
                    location:
                        updatedStartup.location ??
                        "",
                    logo:
                        updatedStartup.logo ??
                        "",
                    coverImage:
                        updatedStartup.coverImage ??
                        "",
                    pitchDeck:
                        updatedStartup.pitchDeck ??
                        "",
                    openToInvestors:
                        updatedStartup.openToInvestors ??
                        false,
                    currentValuation:
                        updatedStartup.currentValuation ??
                        "",
                    fundingGoal:
                        updatedStartup.fundingGoal ??
                        "",
                    equityOffered:
                        updatedStartup.equityOffered ??
                        "",
                });
            }

            alert(
                response.data?.message ||
                    "Startup updated successfully."
            );

            navigate(
                "/startup_builder/dashboard/my-startups"
            );
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to update startup."
            );
        }
    };

    useEffect(() => {
        fetchStartup();
    }, [startupId]);

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center text-white">
                Loading...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-white">
                    Edit Startup
                </h1>

                <p className="mt-2 text-slate-400">
                    Update your startup details.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >
                <div className="space-y-6">
                    <InputField
                        label="Startup Name"
                        required
                        name="name"
                        placeholder="FounderConnect"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Tagline"
                        name="tagline"
                        placeholder="Connecting founders with opportunities"
                        value={formData.tagline}
                        onChange={handleChange}
                    />

                    <TextAreaField
                        label="Description"
                        required
                        name="description"
                        placeholder="Describe your startup..."
                        rows={5}
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <TagInput
                        label="Industries"
                        required
                        placeholder="Type an industry and press Enter"
                        value={formData.industry}
                        onChange={(industry) =>
                            setFormData((prev) => ({
                                ...prev,
                                industry,
                            }))
                        }
                    />

                    <SelectField
                        label="Startup Stage"
                        required
                        name="stage"
                        placeholder="Select Startup Stage"
                        value={formData.stage}
                        onChange={handleChange}
                        options={[
                            "idea",
                            "mvp",
                            "pre_seed",
                            "seed",
                            "series_a",
                            "series_b",
                        ]}
                    />

                    <InputField
                        label="Location"
                        required
                        name="location"
                        placeholder="Bengaluru"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Website"
                        type="url"
                        name="website"
                        placeholder="https://example.com"
                        value={formData.website}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <InputField
                        label="Logo URL"
                        name="logo"
                        placeholder="https://..."
                        value={formData.logo}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Cover Image URL"
                        name="coverImage"
                        placeholder="https://..."
                        value={formData.coverImage}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Pitch Deck URL"
                        name="pitchDeck"
                        placeholder="https://..."
                        value={formData.pitchDeck}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <InputField
                        label="Current Valuation"
                        type="number"
                        name="currentValuation"
                        placeholder="1000000"
                        value={
                            formData.currentValuation
                        }
                        onChange={handleChange}
                    />

                    <InputField
                        label="Funding Goal"
                        type="number"
                        name="fundingGoal"
                        placeholder="500000"
                        value={
                            formData.fundingGoal
                        }
                        onChange={handleChange}
                    />

                    <InputField
                        label="Equity Offered (%)"
                        type="number"
                        name="equityOffered"
                        placeholder="10"
                        value={
                            formData.equityOffered
                        }
                        onChange={handleChange}
                    />

                    <div className="flex items-center gap-3 pt-9">
                        <input
                            type="checkbox"
                            id="openToInvestors"
                            name="openToInvestors"
                            checked={
                                formData.openToInvestors
                            }
                            onChange={handleChange}
                            className="h-5 w-5 accent-violet-600"
                        />

                        <label
                            htmlFor="openToInvestors"
                            className="text-sm font-medium text-white"
                        >
                            Open to Investors
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/startup_builder/dashboard/my-startups"
                            )
                        }
                        className="rounded-xl border border-slate-700 px-6 py-3 text-white transition hover:bg-slate-800"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ManageStartup;