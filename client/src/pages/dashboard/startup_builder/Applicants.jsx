import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api/api";

import {
    Search,
    Users,
} from "lucide-react";

import ApplicantCard from "../../../components/application/ApplicantCard";

function Applicants() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const fetchApplications = async () => {

        try {

            const startupsRes = await api.get(
                "/startups/my-startups",
                {
                    withCredentials: true,
                }
            );

            const startups =
                startupsRes.data.data.startups;

            let allApplications = [];

            for (const startup of startups) {

                const jobsRes = await api.get(
                    `/startups/${startup._id}/jobs`,
                    {
                        withCredentials: true,
                    }
                );

                const jobs =
                    jobsRes.data.data.jobs;

                for (const job of jobs) {

                    const applicantsRes =
                        await api.get(
                            `/jobs/${job._id}/applicants`,
                            {
                                withCredentials: true,
                            }
                        );

                    const applications =
                        applicantsRes.data.data
                            .applications;

                    applications.forEach(
                        (application) => {

                            allApplications.push({

                                ...application,

                                job,

                                startup,

                            });

                        }
                    );

                }

            }

            allApplications.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );

            setApplications(
                allApplications
            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchApplications();

    }, []);

    const filteredApplications = useMemo(() => {

        return applications.filter(
            (application) => {

                const matchesSearch =

                    application.applicant.fullName
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

                    ||

                    application.job.title
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        )

                    ||

                    application.startup.name
                        .toLowerCase()
                        .includes(
                            search.toLowerCase()
                        );

                const matchesStatus =

                    statusFilter === "all"

                    ||

                    application.status ===
                        statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    }, [
        applications,
        search,
        statusFilter,
    ]);

    if (loading) {

        return (

            <div className="flex h-[70vh] items-center justify-center text-white">

                Loading applicants...

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-bold text-white">

                    Applicants

                </h1>

                <p className="mt-2 text-slate-400">

                    Latest applications across all your startups.

                </p>

            </div>

            {/* Stats + Search */}

            <div className="flex flex-wrap items-center justify-between gap-5">

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#111827] px-5 py-4">

                    <Users className="text-violet-400" />

                    <div>

                        <p className="text-sm text-slate-400">

                            Total Applications

                        </p>

                        <h2 className="text-2xl font-bold text-white">

                            {applications.length}

                        </h2>

                    </div>

                </div>

                <div className="relative w-full max-w-md">

                    <Search
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                    />

                    <input
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search applicant, startup or job..."
                        className="w-full rounded-2xl border border-white/10 bg-[#111827] py-3 pl-11 pr-4 text-white outline-none transition focus:border-violet-500"
                    />

                </div>

            </div>

            {/* Filters */}

            <div className="flex flex-wrap gap-3">

                {

                    [
                        "all",
                        "pending",
                        "shortlisted",
                        "accepted",
                        "rejected",
                    ].map((status) => (

                        <button
                            key={status}
                            onClick={() =>
                                setStatusFilter(
                                    status
                                )
                            }
                            className={`rounded-full px-5 py-2 font-medium transition ${
                                statusFilter ===
                                status
                                    ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                                    : "bg-[#111827] text-slate-400 hover:text-white"
                            }`}
                        >

                            {status
                                .charAt(0)
                                .toUpperCase() +
                                status.slice(1)}

                        </button>

                    ))

                }

            </div>

            {/* Empty State */}

            {filteredApplications.length === 0 ? (

                <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#111827] text-slate-400">

                    No applications found.

                </div>

            ) : (

                <div className="space-y-5">

                    {

                        filteredApplications.map(
                            (application) => (

                                <ApplicantCard
                                    key={
                                        application._id
                                    }
                                    application={
                                        application
                                    }
                                    refreshApplicants={
                                        fetchApplications
                                    }
                                />

                            )
                        )

                    }

                </div>

            )}

        </div>

    );

}

export default Applicants;