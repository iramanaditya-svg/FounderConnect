import { useEffect, useMemo, useState } from "react";
import api from "../../services/api/api";
import {
    Briefcase,
    Building2,
    CalendarDays,
    MapPin,
    FileText,
    Clock3,
    CheckCircle2,
    XCircle,
    Eye,
    Trash2,
} from "lucide-react";

function ActiveApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const fetchApplications = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/applications/my",
                {
                    withCredentials: true,
                }
            );

            setApplications(
                response.data.data.applications || []
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const activeApplications = useMemo(() => {
        return applications
            .filter(
                (application) =>
                    application.status === "pending" ||
                    application.status === "shortlisted"
            )
            .sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );
    }, [applications]);

    const handleWithdraw = async (applicationId) => {
        const confirmed = window.confirm(
            "Are you sure you want to withdraw this application?"
        );

        if (!confirmed) return;

        try {
            await api.delete(
                `/applications/${applicationId}`,
                {
                    withCredentials: true,
                }
            );

            await fetchApplications();

            setSelectedApplication(null);
        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to withdraw application."
            );
        }
    };

    const getStatusStyle = (status) => {
        if (status === "shortlisted") {
            return "bg-blue-500/15 text-blue-400 border-blue-500/20";
        }

        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";
    };

    const getStatusIcon = (status) => {
        if (status === "shortlisted") {
            return <CheckCircle2 size={15} />;
        }

        return <Clock3 size={15} />;
    };

    if (loading) {
        return (
            <div className="flex h-[70vh] items-center justify-center text-white">
                Loading applications...
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-4xl font-bold text-white">
                    Active Applications
                </h1>

                <p className="mt-2 text-slate-400">
                    Track the applications that are currently in progress.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15">
                            <Briefcase
                                size={21}
                                className="text-violet-400"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                Active Applications
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-white">
                                {activeApplications.length}
                            </h2>
                        </div>
                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/15">
                            <Clock3
                                size={21}
                                className="text-yellow-400"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                Pending
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-white">
                                {
                                    activeApplications.filter(
                                        (application) =>
                                            application.status === "pending"
                                    ).length
                                }
                            </h2>
                        </div>
                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15">
                            <CheckCircle2
                                size={21}
                                className="text-blue-400"
                            />
                        </div>

                        <div>
                            <p className="text-sm text-slate-400">
                                Shortlisted
                            </p>

                            <h2 className="mt-1 text-3xl font-bold text-white">
                                {
                                    activeApplications.filter(
                                        (application) =>
                                            application.status === "shortlisted"
                                    ).length
                                }
                            </h2>
                        </div>
                    </div>

                </div>

            </div>

            {activeApplications.length === 0 ? (

                <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#111827]">

                    <div className="text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
                            <Briefcase
                                size={28}
                                className="text-slate-500"
                            />
                        </div>

                        <h2 className="mt-5 text-xl font-semibold text-white">
                            No active applications
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Applications that are pending or shortlisted will appear here.
                        </p>

                    </div>

                </div>

            ) : (

                <div className="space-y-5">

                    {activeApplications.map((application) => {

                        const job = application.job;
                        const startup = job?.startup;

                        return (
                            <div
                                key={application._id}
                                className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/40"
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                                    <div className="flex gap-4">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600">

                                            <Building2
                                                size={24}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-2xl font-bold text-white">
                                                {job?.title || "Job"}
                                            </h2>

                                            <p className="mt-1 text-base font-medium text-violet-400">
                                                {startup?.name || "Startup"}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">

                                                {startup?.location && (
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={16} />
                                                        {startup.location}
                                                    </div>
                                                )}

                                                <div className="flex items-center gap-2">
                                                    <CalendarDays size={16} />
                                                    {new Date(
                                                        application.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                    <div
                                        className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold capitalize ${getStatusStyle(
                                            application.status
                                        )}`}
                                    >
                                        {getStatusIcon(
                                            application.status
                                        )}

                                        {application.status}
                                    </div>

                                </div>

                                {application.coverLetter && (
                                    <div className="mt-6 rounded-2xl bg-[#0B1220] p-5">

                                        <div className="flex items-center gap-2">

                                            <FileText
                                                size={17}
                                                className="text-violet-400"
                                            />

                                            <h3 className="font-semibold text-white">
                                                Cover Letter
                                            </h3>

                                        </div>

                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            {application.coverLetter}
                                        </p>

                                    </div>
                                )}

                                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">

                                    <div className="flex items-center gap-2 text-sm text-slate-500">

                                        <CalendarDays size={16} />

                                        Applied on{" "}
                                        {new Date(
                                            application.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}

                                    </div>

                                    <div className="flex gap-3">

                                        <button
                                            onClick={() =>
                                                setSelectedApplication(
                                                    application
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-violet-600 hover:text-white"
                                        >
                                            <Eye size={17} />
                                            View Details
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleWithdraw(
                                                    application._id
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 size={17} />
                                            Withdraw
                                        </button>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            )}

            {selectedApplication && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0F172A] p-8 shadow-2xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <h2 className="text-3xl font-bold text-white">
                                    {selectedApplication.job?.title}
                                </h2>

                                <p className="mt-2 text-violet-400">
                                    {selectedApplication.job?.startup?.name}
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setSelectedApplication(null)
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <XCircle size={24} />
                            </button>

                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <div className="rounded-2xl bg-white/5 p-5">

                                <p className="text-sm text-slate-500">
                                    Status
                                </p>

                                <p className="mt-2 font-semibold capitalize text-white">
                                    {selectedApplication.status}
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white/5 p-5">

                                <p className="text-sm text-slate-500">
                                    Applied On
                                </p>

                                <p className="mt-2 font-semibold text-white">
                                    {new Date(
                                        selectedApplication.createdAt
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        }
                                    )}
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white/5 p-5">

                                <p className="text-sm text-slate-500">
                                    Location
                                </p>

                                <p className="mt-2 font-semibold text-white">
                                    {selectedApplication.job?.location ||
                                        selectedApplication.job?.startup?.location ||
                                        "Not specified"}
                                </p>

                            </div>

                            <div className="rounded-2xl bg-white/5 p-5">

                                <p className="text-sm text-slate-500">
                                    Work Mode
                                </p>

                                <p className="mt-2 font-semibold capitalize text-white">
                                    {selectedApplication.job?.workMode
                                        ?.replace("_", " ") ||
                                        "Not specified"}
                                </p>

                            </div>

                        </div>

                        {selectedApplication.coverLetter && (
                            <div className="mt-6 rounded-2xl bg-white/5 p-5">

                                <h3 className="font-semibold text-white">
                                    Cover Letter
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    {selectedApplication.coverLetter}
                                </p>

                            </div>
                        )}

                        {selectedApplication.resume && (
                            <a
                                href={selectedApplication.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 font-semibold text-white transition hover:scale-[1.01]"
                            >
                                <FileText size={18} />
                                View Resume
                            </a>
                        )}

                        <button
                            onClick={() =>
                                setSelectedApplication(null)
                            }
                            className="mt-4 w-full rounded-xl border border-white/10 py-3 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                            Close
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ActiveApplications;