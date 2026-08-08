import {
    User,
    FileText,
    ExternalLink,
    CheckCircle,
    XCircle,
    Briefcase,
    Building2,
    CalendarDays,
} from "lucide-react";
import { useNavigate } from "react-router-dom";



import axios from "axios";

function ApplicantCard({
    application,
    refreshApplicants,
}) {
const navigate = useNavigate();
    const updateStatus = async (status) => {

        try {

            const response = await axios.patch(

                `http://localhost:8000/api/v1/applications/${application._id}/status`,

                {
                    status,
                },

                {
                    withCredentials: true,
                }

            );

            alert(response.data.message);

            refreshApplicants();

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Something went wrong."

            );

        }

    };

    return (

        <div 
        onClick={() =>
    navigate(
        `/startup_builder/dashboard/applicants/${application._id}`,
        {
            state: {
                application,
            },
        }
    )
}
        className="rounded-3xl border border-white/10 bg-[#111827] p-7">

<div className="flex items-start justify-between">

    <div className="flex gap-5">

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]">

            <User
                size={28}
                className="text-white"
            />

        </div>

        <div>

            <h2 className="text-2xl font-bold text-white">

                {application.applicant.fullName}

            </h2>

            <p className="mt-1 text-slate-400">

                {

                    application.professionalProfile
                        ?.headline ||

                    "No headline"

                }

            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">

                <div className="flex items-center gap-2">

                    <Briefcase size={16} />

                    {application.job.title}

                </div>

                <div className="flex items-center gap-2">

                    <Building2 size={16} />

                    {application.startup.name}

                </div>

                <div className="flex items-center gap-2">

                    <CalendarDays size={16} />

                    {new Date(
                        application.createdAt
                    ).toLocaleDateString()}
                </div>

            </div>

            <div className="mt-4 flex flex-wrap gap-2">

                {

                    application.professionalProfile
                        ?.skills
                        ?.map((skill) => (

                            <span
                                key={skill}
                                className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                            >

                                {skill}

                            </span>

                        ))

                }

            </div>

        </div>

    </div>

    <span
        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize

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

            <div className="mt-8 rounded-2xl bg-[#0F172A] p-5">

                <h3 className="font-semibold text-white">

                    Cover Letter

                </h3>

                <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">

                    {

                        application.coverLetter ||

                        "No cover letter submitted."

                    }

                </p>

            </div>

            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">

                    <button
                        onClick={() =>
                            window.open(
                                application.professionalProfile?.resume,
                                "_blank"
                            )
                        }
                        className="flex items-center gap-2 rounded-xl border border-blue-500/30 px-4 py-2 text-blue-400 transition hover:bg-blue-500/10"
                    >

                        <ExternalLink size={18} />

                        View Resume

                    </button>

                </div>

                <div className="flex items-center gap-3">

                    {

                        application.status === "pending" && (

                            <>

                                <button
                                    onClick={() =>
                                        updateStatus("shortlisted")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                                >

                                    <CheckCircle size={18} />

                                    Shortlist

                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus("rejected")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                                >

                                    <XCircle size={18} />

                                    Reject

                                </button>

                            </>

                        )

                    }

                    {

                        application.status === "shortlisted" && (

                            <>

                                <button
                                    onClick={() =>
                                        updateStatus("accepted")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-700"
                                >

                                    <CheckCircle size={18} />

                                    Accept

                                </button>

                                <button
                                    onClick={() =>
                                        updateStatus("rejected")
                                    }
                                    className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700"
                                >

                                    <XCircle size={18} />

                                    Reject

                                </button>

                            </>

                        )

                    }

                    {

                        application.status === "accepted" && (

                            <button
                                disabled
                                className="cursor-not-allowed rounded-xl bg-green-600 px-5 py-2 font-semibold text-white opacity-70"
                            >

                                ✓ Accepted

                            </button>

                        )

                    }

                    {

                        application.status === "rejected" && (

                            <button
                                disabled
                                className="cursor-not-allowed rounded-xl bg-red-600 px-5 py-2 font-semibold text-white opacity-70"
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

export default ApplicantCard;