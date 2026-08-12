import {
    ArrowLeft,
    User,
    Briefcase,
    Building2,
    CalendarDays,
    ExternalLink,
    CheckCircle,
    XCircle,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api/api";

function ApplicantDetails() {

    const navigate = useNavigate();

    const { state } = useLocation();

    const application = state?.application;

    if (!application) {

        return (

            <div className="flex h-[70vh] items-center justify-center text-white">

                Applicant not found.

            </div>

        );

    }

    const updateStatus = async (status) => {

        try {

            const response = await api.patch(

                `/applications/${application._id}/status`,

                {
                    status,
                },

                {
                    withCredentials: true,
                }

            );

            alert(response.data.message);

            navigate(-1);

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Something went wrong."

            );

        }

    };

    return (

        <div className="mx-auto max-w-5xl space-y-8">

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 transition hover:text-white"
            >

                <ArrowLeft size={18} />

                Back

            </button>

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-8">

                <div className="flex items-start justify-between">

                    <div className="flex gap-5">

                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">

                            <User
                                size={34}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-4xl font-bold text-white">

                                {application.applicant.fullName}

                            </h1>

                            <p className="mt-2 text-slate-400">

                                {

                                    application.professionalProfile
                                        ?.headline ||

                                    "No headline"

                                }

                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">

                                {

                                    application.professionalProfile
                                        ?.skills
                                        ?.map((skill) => (

                                            <span
                                                key={skill}
                                                className="rounded-full bg-violet-500/10 px-3 py-1 text-sm text-violet-300"
                                            >

                                                {skill}

                                            </span>

                                        ))

                                }

                            </div>

                        </div>

                    </div>

                    <span
                        className={`rounded-full px-5 py-2 text-sm font-semibold capitalize

                        ${
                            application.status === "pending"

                            ?

                            "bg-yellow-500/20 text-yellow-400"

                            :

                            application.status === "shortlisted"

                            ?

                            "bg-blue-500/20 text-blue-400"

                            :

                            application.status === "accepted"

                            ?

                            "bg-green-500/20 text-green-400"

                            :

                            "bg-red-500/20 text-red-400"

                        }`}
                    >

                        {application.status}

                    </span>

                </div>
                                <div className="mt-10 grid gap-6 md:grid-cols-2">

                    <div className="rounded-2xl bg-[#0F172A] p-6">

                        <h2 className="mb-5 text-xl font-semibold text-white">

                            Job Details

                        </h2>

                        <div className="space-y-4">

                            <div className="flex items-center gap-3 text-slate-300">

                                <Briefcase size={18} />

                                <span>

                                    {application.job.title}

                                </span>

                            </div>

                            <div className="flex items-center gap-3 text-slate-300">

                                <Building2 size={18} />

                                <span>

                                    {application.startup.name}

                                </span>

                            </div>

                            <div className="flex items-center gap-3 text-slate-300">

                                <CalendarDays size={18} />

                                <span>

                                    {new Date(
                                        application.createdAt
                                    ).toLocaleString()}

                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl bg-[#0F172A] p-6">

                        <h2 className="mb-5 text-xl font-semibold text-white">

                            Resume

                        </h2>

                        <p className="mb-6 text-slate-400">

                            View the applicant's uploaded resume.

                        </p>

                        <button
                            onClick={() =>
                                window.open(
                                    application.professionalProfile?.resume,
                                    "_blank"
                                )
                            }
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-5 py-3 font-semibold text-white transition hover:opacity-90"
                        >

                            <ExternalLink size={18} />

                            View Resume

                        </button>

                    </div>

                </div>

                <div className="mt-8 rounded-2xl bg-[#0F172A] p-6">

                    <h2 className="mb-5 text-xl font-semibold text-white">

                        Cover Letter

                    </h2>

                    <p className="whitespace-pre-wrap leading-8 text-slate-300">

                        {

                            application.coverLetter ||

                            "No cover letter submitted."

                        }

                    </p>

                </div>

                <div className="mt-8 flex justify-end gap-4">

                    {

                        application.status === "pending" && (

                            <>

                                <button
                                    onClick={() =>
                                        updateStatus("rejected")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                                >

                                    <XCircle size={18} />

                                    Reject

                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus("shortlisted")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                                >

                                    <CheckCircle size={18} />

                                    Shortlist

                                </button>

                            </>

                        )

                    }

                    {

                        application.status === "shortlisted" && (

                            <>

                                <button
                                    onClick={() =>
                                        updateStatus("rejected")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                                >

                                    <XCircle size={18} />

                                    Reject

                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus("accepted")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                                >

                                    <CheckCircle size={18} />

                                    Accept

                                </button>

                            </>

                        )

                    }

                    {

                        application.status === "accepted" && (

                            <button
                                disabled
                                className="cursor-not-allowed rounded-xl bg-green-600 px-6 py-3 font-semibold text-white opacity-70"
                            >

                                ✓ Accepted

                            </button>

                        )

                    }

                    {

                        application.status === "rejected" && (

                            <button
                                disabled
                                className="cursor-not-allowed rounded-xl bg-red-600 px-6 py-3 font-semibold text-white opacity-70"
                            >

                                Rejected

                            </button>

                        )

                    }

                </div>

            </div>

        </div>

    );

}

export default ApplicantDetails;