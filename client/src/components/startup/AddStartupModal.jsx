import { useState } from "react";
import { X } from "lucide-react";
import api from "../../services/api/api";

import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import SelectField from "../ui/SelectField";
import TagInput from "../ui/TagInput";

function AddStartupModal({ open, onClose, onSuccess, }) {
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
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post(
                "/startups",
                formData,
                {
                    withCredentials: true,
                }
            );

            alert(response.data.message);

            console.log(response.data);

            onSuccess?.();

            setFormData({
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
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                    "Failed to create startup."
            );
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#0F172A] p-8 shadow-2xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>
                        <h2 className="text-3xl font-bold text-white">
                            Create Startup
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Fill in your startup details.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                    >
                        <X size={24} />
                    </button>

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

                                        {/* Media */}

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



                    {/* Funding */}

                    <div className="grid grid-cols-2 gap-6">

                        <InputField
                            label="Current Valuation"
                            type="number"
                            name="currentValuation"
                            placeholder="1000000"
                            value={formData.currentValuation}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Funding Goal"
                            type="number"
                            name="fundingGoal"
                            placeholder="500000"
                            value={formData.fundingGoal}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Equity Offered (%)"
                            type="number"
                            name="equityOffered"
                            placeholder="10"
                            value={formData.equityOffered}
                            onChange={handleChange}
                        />

                        <div className="flex items-center gap-3 pt-9">

                            <input
                                type="checkbox"
                                id="openToInvestors"
                                name="openToInvestors"
                                checked={formData.openToInvestors}
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



                    {/* Footer */}

                    <div className="flex justify-end gap-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-700 px-6 py-3 text-white transition hover:bg-slate-800"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
                        >
                            Create Startup
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddStartupModal;