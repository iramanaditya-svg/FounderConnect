
import {
    Building2,
    MapPin,
    IndianRupee,
    CalendarDays,
    ExternalLink,
} from "lucide-react";

import { Link } from "react-router-dom";
import api from "../../services/api/api";

function AppliedJobCard({ application }) {

    const {
        _id,
        status,
        createdAt,
        job,
    } = application;

    const getStatusColor = () => {

        switch (status) {

            case "pending":
                return "bg-yellow-500/20 text-yellow-400";

            case "shortlisted":
                return "bg-blue-500/20 text-blue-400";

            case "accepted":
                return "bg-green-500/20 text-green-400";

            case "rejected":
                return "bg-red-500/20 text-red-400";

            default:
                return "bg-slate-500/20 text-slate-300";

        }

    };

    const withdrawApplication = async () => {

        const confirmWithdraw = window.confirm(
            "Withdraw this application?"
        );

        if (!confirmWithdraw) return;

        try {

            const response = await api.delete(
                `/applications/${_id}`,
                {
                    withCredentials: true,
                }
            );

            alert(response.data.message);

            window.location.reload();

        }

        catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to withdraw."
            );

        }

    };

    return (

        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/40">

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <Building2
                            size={42}
                            className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] p-2 text-white"
                        />

                        <div>

                            <h2 className="text-2xl font-bold text-white">

                                {job.title}

                            </h2>

                            <p className="mt-1 text-slate-400">

                                {job.startup.name}

                            </p>

                        </div>

                    </div>

                    <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">

                        <div className="flex items-center gap-2">

                            <MapPin size={16} />

                            {job.location}

                        </div>

                        <div className="flex items-center gap-2">

                            <CalendarDays size={16} />

                            Applied{" "}
                            {new Date(
                                createdAt
                            ).toLocaleDateString()}

                        </div>

                    </div>

                </div>

                <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusColor()}`}
                >

                    {status}

                </span>

            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-5">

                <div className="flex items-center gap-1 text-xl font-bold text-green-400">

                    <IndianRupee size={18} />

                    {job.minSalary?.toLocaleString()} -

                    {job.maxSalary?.toLocaleString()}

                </div>
                                <div className="flex items-center gap-3">

                    <Link
                        to={`/professional/dashboard/startups/${job.startup._id}`}
                        className="flex items-center gap-2 rounded-xl border border-violet-500/40 px-4 py-2 text-violet-400 transition hover:bg-violet-500/10"
                    >

                        <ExternalLink size={18} />

                        View Startup

                    </Link>

                    {(status === "pending" ||
                        status === "shortlisted") && (

                        <button
                            onClick={withdrawApplication}
                            className="rounded-xl bg-red-500 px-4 py-2 font-medium text-white transition hover:bg-red-600"
                        >

                            Withdraw

                        </button>

                    )}

                    {(status === "accepted" ||
                        status === "rejected") && (

                        <button
                            disabled
                            className="cursor-not-allowed rounded-xl bg-slate-700 px-4 py-2 font-medium text-slate-400"
                        >

                            {status === "accepted"
                                ? "Accepted"
                                : "Rejected"}

                        </button>

                    )}

                </div>

            </div>

        </div>

    );

}

export default AppliedJobCard;