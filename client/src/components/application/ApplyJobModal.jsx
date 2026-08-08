import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";

function ApplyJobModal({
    open,
    onClose,
    job,
    onSuccess,
}) {

    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState("");
    const [loading, setLoading] = useState(false);

    const [checkingResume, setCheckingResume] = useState(true);
    const [hasResume, setHasResume] = useState(false);

    useEffect(() => {

        if (!open) return;

        setCheckingResume(true);

        const checkResume = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:8000/api/v1/professional/check-resume",
                    {
                        withCredentials: true,
                    }
                );

                setHasResume(
                    response.data.data.hasResume
                );

            } catch (error) {

                console.log(error);

                setHasResume(false);

            } finally {

                setCheckingResume(false);

            }

        };

        checkResume();

    }, [open]);

    if (!open || !job) return null;

    if (checkingResume) {

        return (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                <div className="rounded-3xl border border-white/10 bg-[#111827] px-10 py-8">

                    <h2 className="text-xl font-semibold text-white">

                        Checking Profile...

                    </h2>

                </div>

            </div>

        );

    }

    if (!hasResume) {

        return (

            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

                <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#111827] p-8">

                    <h2 className="text-3xl font-bold text-white">

                        Resume Required

                    </h2>

                    <p className="mt-4 leading-7 text-slate-400">

                        You haven't uploaded your resume yet.
                        Upload your resume first to apply for jobs.

                    </p>

                    <div className="mt-8 flex gap-4">

                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-slate-700 py-3 font-semibold text-white transition hover:bg-slate-600"
                        >

                            Close

                        </button>

                        <button
    onClick={() =>
        navigate(
            "/professional/dashboard/edit-profile",
            {
                state: {
                    returnTo: location.pathname,
                    reopenApply: true,
                    jobId: job._id,
                },
            }
        )
    }
    className="flex-1 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:opacity-90"
>
    Upload Resume
</button>


                    </div>

                </div>

            </div>

        );

    }

    const handleApply = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await axios.post(
                `http://localhost:8000/api/v1/jobs/${job._id}/apply`,
                {
                    coverLetter,
                },
                {
                    withCredentials: true,
                }
            );

            alert(response.data.message);

            setCoverLetter("");

            onSuccess?.();

            onClose();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to apply."
            );

        } finally {

            setLoading(false);

        }

    };
        return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

            <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#111827] p-8">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-3xl font-bold text-white">

                            Apply for Job

                        </h2>

                        <p className="mt-2 text-slate-400">

                            {job.title}

                        </p>

                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-xl bg-white/5 px-4 py-2 text-white transition hover:bg-red-500"
                    >

                        ✕

                    </button>

                </div>

                <form
                    onSubmit={handleApply}
                    className="mt-8 space-y-6"
                >

                    <div>

                        <label className="mb-3 block text-sm font-medium text-white">

                            Cover Letter

                        </label>

                        <textarea
                            rows={8}
                            value={coverLetter}
                            onChange={(e) =>
                                setCoverLetter(e.target.value)
                            }
                            placeholder="Tell the startup why you're the right fit for this role..."
                            className="w-full rounded-2xl border border-white/10 bg-[#0F172A] p-4 text-white outline-none transition focus:border-violet-500"
                        />

                        <p className="mt-2 text-sm text-slate-500">

                            Your uploaded resume will automatically be attached with this application.

                        </p>

                    </div>

                    <div className="flex gap-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-white/10 bg-[#1F2937] py-3 font-semibold text-white transition hover:bg-[#374151]"
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        >

                            {loading
                                ? "Submitting..."
                                : "Apply Now"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default ApplyJobModal;