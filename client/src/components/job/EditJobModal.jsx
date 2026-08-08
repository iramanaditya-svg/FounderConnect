import axios from "axios";

import JobForm from "./JobForm";
function EditJobModal({
    open,
    onClose,
    job,
    onSuccess,
}) {

    if (!open || !job) return null;

    const handleSubmit = async (formData) => {

        try {

            const response = await axios.patch(
                `http://localhost:8000/api/v1/jobs/${job._id}`,
                formData,
                {
                    withCredentials: true,
                }
            );

            alert(response.data.message);

            onSuccess();

            onClose();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to update job."
            );

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0F172A] p-8">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2 className="text-3xl font-bold text-white">
                            Edit Job
                        </h2>

                        <p className="mt-2 text-slate-400">
                            Update your job posting.
                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl bg-white/5 px-4 py-2 text-white transition hover:bg-red-500"
                    >
                        ✕
                    </button>

                </div>

                <JobForm
                    initialData={job}
                    submitText="Save Changes"
                    onSubmit={handleSubmit}
                />

            </div>

        </div>

    );

}

export default EditJobModal;