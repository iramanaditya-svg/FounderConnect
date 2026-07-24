import { motion } from "framer-motion";
import InputField from "../ui/InputField";
import TagInput from "../ui/TagInput";
import { useState } from "react";
import SelectField from "../ui/SelectField";

import { createProfessionalProfile } from "../../services/api/professional.service";
function ProfessionalForm() {
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
        github: "",
        linkedin: "",
        portfolio: "",
    });

    const [errors, setErrors] = useState({});
    const validateForm = () => {
    const newErrors = {};

    if (!formData.headline.trim()) {
        newErrors.headline = "Headline is required.";
    }

    if (formData.skills.length === 0) {
        newErrors.skills = "Please add at least one skill.";
    }

    if (!formData.experience) {
        newErrors.experience = "Please select your experience.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
        const response =
            await createProfessionalProfile(formData);

        console.log(response);

        navigate("/professional/dashboard");
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
                        Build a profile that helps founders discover your talent.
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

                        <InputField
                            label="Headline"
                            required
                            placeholder="Frontend Developer | React"
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

                        <TagInput
                            label="Skills"
                            required
                            value={formData.skills}
                            onChange={(newSkills) =>
                                setFormData({
                                    ...formData,
                                    skills: newSkills,
                                })
                            }
                        />

                        {errors.skills && (
    <p className="mt-2 text-sm text-red-500">
        {errors.skills}
    </p>
)}

                    </div>



                    <div className="space-y-6">

                        <SelectField
                            label="Experience"
                            required
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
{errors.experience && (
    <p className="mt-2 text-sm text-red-500">
        {errors.experience}
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
                        value={formData.education.college}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                education: {
                                    ...formData.education,
                                    college: e.target.value,
                                },
                            })
                        }
                    />

                    <InputField
                        label="Degree"
                        placeholder="B.Tech"
                        value={formData.education.degree}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                education: {
                                    ...formData.education,
                                    degree: e.target.value,
                                },
                            })
                        }
                    />

                    <InputField
                        label="Branch"
                        placeholder="Electronics & Communication Engineering"
                        value={formData.education.branch}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                education: {
                                    ...formData.education,
                                    branch: e.target.value,
                                },
                            })
                        }
                    />

                    <InputField
                        label="Graduation Year"
                        type="number"
                        placeholder="2030"
                        value={formData.education.graduationYear}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                education: {
                                    ...formData.education,
                                    graduationYear: e.target.value,
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
                        value={formData.linkedin}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                linkedin: e.target.value,
                            })
                        }
                    />

                    <InputField
                        label="GitHub"
                        placeholder="https://github.com/username"
                        value={formData.github}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                github: e.target.value,
                            })
                        }
                    />

                    <InputField
                        label="Portfolio"
                        placeholder="https://yourportfolio.com"
                        value={formData.portfolio}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                portfolio: e.target.value,
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

                <div className="mt-6 rounded-2xl border-2 border-dashed border-white/10 bg-[#111827] p-8 text-center transition-all duration-300 hover:border-blue-500 hover:bg-[#1b2435] hover:cursor-pointer">

                    <p className="text-lg font-medium text-white">
                        Upload Resume
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        PDF only • Max 5 MB
                    </p>

                </div>

                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-8">
                    <div>
                        <button
                            type="button"
                            className="text-sm font-medium text-gray-400 transition duration-300 hover:text-white hover:cursor-pointer"
                        >
                            Skip for now
                        </button>

                        <p className="mt-2 max-w-xs text-xs text-gray-500">
                            You can complete your profile later from your dashboard before applying to any startup.
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

export default ProfessionalForm;