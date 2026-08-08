import { useState } from "react";

import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import SelectField from "../ui/SelectField";
import TagInput from "../ui/TagInput";

function JobForm({
    initialData,
    onSubmit,
    submitText,
}) {
    const [formData, setFormData] = useState({
    title: initialData?.title || "",
    employmentType:
        initialData?.employmentType || "",
    workMode:
        initialData?.workMode || "",
    location:
        initialData?.location || "",
    description:
        initialData?.description || "",
    requirements:
        initialData?.requirements || [],
    responsibilities:
        initialData?.responsibilities || [],
    requiredSkills:
        initialData?.requiredSkills || [],
    experienceLevel:
        initialData?.experienceLevel || "",
    minSalary:
        initialData?.minSalary || "",
    maxSalary:
        initialData?.maxSalary || "",
    numberOfOpenings:
        initialData?.numberOfOpenings || 1,
    applicationDeadline:
        initialData?.applicationDeadline?.split("T")[0] || "",
});
const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));

};
const handleSubmit = (e) => {

    e.preventDefault();

    onSubmit(formData);

};
return (

<form
    onSubmit={handleSubmit}
    className="space-y-8"
>
    <div className="grid grid-cols-2 gap-6">

    <InputField
        label="Job Title"
        required
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Frontend Developer"
    />

    <InputField
        label="Location"
        required
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Bengaluru"
    />

    <SelectField
        label="Employment Type"
        required
        name="employmentType"
        value={formData.employmentType}
        onChange={handleChange}
        options={[
            "full_time",
            "part_time",
            "internship",
            "contract",
        ]}
    />

    <SelectField
        label="Work Mode"
        required
        name="workMode"
        value={formData.workMode}
        onChange={handleChange}
        options={[
            "remote",
            "hybrid",
            "on_site",
        ]}
    />

</div>
<TextAreaField
    label="Description"
    required
    rows={6}
    name="description"
    value={formData.description}
    onChange={handleChange}
/>
<div className="grid grid-cols-1 gap-6">

    <TagInput
        label="Responsibilities"
        placeholder="Type a responsibility and press Enter"
        value={formData.responsibilities}
        onChange={(responsibilities) =>
            setFormData((prev) => ({
                ...prev,
                responsibilities,
            }))
        }
    />

    <TagInput
        label="Requirements"
        placeholder="Type a requirement and press Enter"
        value={formData.requirements}
        onChange={(requirements) =>
            setFormData((prev) => ({
                ...prev,
                requirements,
            }))
        }
    />

    <TagInput
        label="Required Skills"
        placeholder="Type a skill and press Enter"
        value={formData.requiredSkills}
        onChange={(requiredSkills) =>
            setFormData((prev) => ({
                ...prev,
                requiredSkills,
            }))
        }
    />

</div>

<div className="grid grid-cols-2 gap-6">

    <InputField
        label="Minimum Salary"
        type="number"
        name="minSalary"
        value={formData.minSalary}
        onChange={handleChange}
        placeholder="400000"
    />

    <InputField
        label="Maximum Salary"
        type="number"
        name="maxSalary"
        value={formData.maxSalary}
        onChange={handleChange}
        placeholder="1200000"
    />

    <SelectField
        label="Experience Level"
        required
        name="experienceLevel"
        value={formData.experienceLevel}
        onChange={handleChange}
        options={[
            "fresher",
            "0_2",
            "2_5",
            "5_plus",
        ]}
    />

    <InputField
        label="Number of Openings"
        type="number"
        name="numberOfOpenings"
        value={formData.numberOfOpenings}
        onChange={handleChange}
        placeholder="1"
    />

    <InputField
        label="Application Deadline"
        type="date"
        name="applicationDeadline"
        value={formData.applicationDeadline}
        onChange={handleChange}
    />

</div>

<div className="flex justify-end">

    <button
        type="submit"
        className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-8 py-3 font-semibold text-white transition hover:scale-105"
    >
        {submitText}
    </button>

</div>

</form>

);

}

export default JobForm;
