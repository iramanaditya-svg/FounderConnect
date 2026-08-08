import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    BriefcaseBusiness,
    Users,
    Building2,
    RefreshCw,
    Plus,
    CheckCircle2,
    Clock3,
    XCircle,
    PauseCircle,
} from "lucide-react";

import WelcomeBanner from "../dashboard/WelcomeBanner";
import StartupFeed from "../../components/startup/StartupFeed";


function Home() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const role = user?.activeRole;


    const [startups, setStartups] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(
        role === "startup_builder"
    );

    const [refreshing, setRefreshing] = useState(false);

    const [error, setError] = useState("");




    const fetchDashboardData = async (
        showLoader = true
    ) => {

        if (role !== "startup_builder") {
            return;
        }

        try {

            if (showLoader) {
                setLoading(true);
            }

            setRefreshing(true);
            setError("");

            const startupsResponse =
                await axios.get(
                    "http://localhost:8000/api/v1/startups/my-startups",
                    {
                        withCredentials: true,
                    }
                );


            const myStartups =
                startupsResponse.data?.data?.startups || [];


            setStartups(myStartups);




            const jobsResponse =
                await Promise.all(

                    myStartups.map(
                        async (startup) => {

                            try {

                                const response =
                                    await axios.get(
                                        `http://localhost:8000/api/v1/startups/${startup._id}/jobs`,
                                        {
                                            withCredentials: true,
                                        }
                                    );

                                return (
                                    response.data?.data?.jobs ||
                                    []
                                );

                            } catch (error) {

                                console.error(
                                    `Failed to fetch jobs for startup ${startup._id}`,
                                    error
                                );

                                return [];
                            }

                        }
                    )

                );


            const allJobs =
                jobsResponse.flat();



            allJobs.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );


            setJobs(allJobs);



            const applicantResponses =
                await Promise.all(

                    allJobs.map(
                        async (job) => {

                            try {

                                const response =
                                    await axios.get(
                                        `http://localhost:8000/api/v1/jobs/${job._id}/applicants`,
                                        {
                                            withCredentials: true,
                                        }
                                    );


                                const jobApplications =
                                    response.data?.data
                                        ?.applications || [];


                                return jobApplications.map(
                                    (application) => ({

                                        ...application,

                                        job,

                                    })
                                );


                            } catch (error) {

                                console.error(
                                    `Failed to fetch applicants for job ${job._id}`,
                                    error
                                );

                                return [];
                            }

                        }
                    )

                );


            const allApplications =
                applicantResponses.flat();


            allApplications.sort(
                (a, b) =>
                    new Date(b.createdAt) -
                    new Date(a.createdAt)
            );


            setApplications(
                allApplications
            );


        } catch (error) {

            console.error(
                "Dashboard fetch error:",
                error
            );


            setError(
                error.response?.data?.message ||
                "Failed to load dashboard data."
            );


        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    };


    useEffect(() => {

        if (role === "startup_builder") {

            fetchDashboardData();

        }

    }, [role]);


    const jobStats = useMemo(() => {

        const open =
            jobs.filter(
                (job) =>
                    job.status === "open"
            ).length;


        const closed =
            jobs.filter(
                (job) =>
                    job.status === "closed"
            ).length;


        const paused =
            jobs.filter(
                (job) =>
                    job.status === "paused"
            ).length;


        return {
            total: jobs.length,
            open,
            closed,
            paused,
        };

    }, [jobs]);



    const applicationStats = useMemo(() => {

        const pending =
            applications.filter(
                (application) =>
                    application.status === "pending"
            ).length;


        const shortlisted =
            applications.filter(
                (application) =>
                    application.status === "shortlisted"
            ).length;


        const accepted =
            applications.filter(
                (application) =>
                    application.status === "accepted"
            ).length;


        const rejected =
            applications.filter(
                (application) =>
                    application.status === "rejected"
            ).length;


        return {
            pending,
            shortlisted,
            accepted,
            rejected,
            total: applications.length,
        };

    }, [applications]);




    const applicationsByJob = useMemo(() => {

        return jobs
            .map((job) => {

                const count =
                    applications.filter(
                        (application) =>
                            application.job?._id ===
                            job._id
                    ).length;


                return {
                    job,
                    count,
                };

            })
            .filter(
                (item) =>
                    item.count > 0
            )
            .sort(
                (a, b) =>
                    b.count - a.count
            )
            .slice(0, 6);

    }, [jobs, applications]);


    const maxApplicationCount =
        Math.max(
            ...applicationsByJob.map(
                (item) => item.count
            ),
            1
        );




    const handlePostJob = () => {

        
        navigate(
            "/startup_builder/dashboard/my-jobs"
        );

    };


    const handleManageStartup = () => {

        navigate(
            "/startup_builder/dashboard/my-startups"
        );

    };


    const handleViewApplications = () => {

        navigate(
            "/startup_builder/dashboard/applicants"
        );

    };



    if (role === "professional") {

        return (

            <div className="space-y-8">

                <WelcomeBanner />

                <StartupFeed />

            </div>

        );

    }


    if (role === "investor") {

        return (

            <div className="space-y-8">

                <WelcomeBanner />

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-8">

                    <h2 className="text-xl font-semibold text-white">
                        Investor Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Your investor workspace will appear here.
                    </p>

                </div>

            </div>

        );

    }



    if (loading) {

        return (

            <div className="space-y-8">

                <WelcomeBanner />

                <div className="flex h-96 items-center justify-center rounded-3xl border border-white/10 bg-[#111827]">

                    <div className="text-center">

                        <RefreshCw
                            size={32}
                            className="mx-auto animate-spin text-violet-500"
                        />

                        <p className="mt-4 text-slate-400">
                            Loading dashboard...
                        </p>

                    </div>

                </div>

            </div>

        );

    }




    return (

        <div className="space-y-8">


            <WelcomeBanner />




            {error && (

                <div className="flex items-center justify-between rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4">

                    <p className="text-sm text-red-400">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            fetchDashboardData()
                        }
                        className="rounded-lg bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-500/30"
                    >
                        Retry
                    </button>

                </div>

            )}


            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                <div>

                    <h2 className="text-2xl font-bold text-white">
                        Dashboard Overview
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                        Track your jobs and hiring activity.
                    </p>

                </div>


                <button
                    onClick={() =>
                        fetchDashboardData(false)
                    }
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#111827] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                >

                    <RefreshCw
                        size={17}
                        className={
                            refreshing
                                ? "animate-spin"
                                : ""
                        }
                    />

                    Refresh

                </button>

            </div>



            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">




                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Jobs Posted
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-white">
                                {jobStats.total}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-blue-500/10 p-4">

                            <BriefcaseBusiness
                                size={25}
                                className="text-blue-400"
                            />

                        </div>

                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        Across {startups.length} startup
                        {startups.length !== 1 ? "s" : ""}
                    </p>

                </div>




                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Open Jobs
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-white">
                                {jobStats.open}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-green-500/10 p-4">

                            <CheckCircle2
                                size={25}
                                className="text-green-400"
                            />

                        </div>

                    </div>

                    <p className="mt-4 text-sm text-green-400">
                        Currently accepting applications
                    </p>

                </div>




                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Applications
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-white">
                                {applicationStats.total}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-violet-500/10 p-4">

                            <Users
                                size={25}
                                className="text-violet-400"
                            />

                        </div>

                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                        Across all your jobs
                    </p>

                </div>




                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Shortlisted
                            </p>

                            <h2 className="mt-3 text-4xl font-bold text-white">
                                {applicationStats.shortlisted}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-yellow-500/10 p-4">

                            <Clock3
                                size={25}
                                className="text-yellow-400"
                            />

                        </div>

                    </div>

                    <p className="mt-4 text-sm text-yellow-400">
                        Candidates in review
                    </p>

                </div>

            </div>



            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">




                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Job Status
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Current state of your job postings
                        </p>

                    </div>


                    <div className="mt-8 space-y-5">




                        <div>

                            <div className="mb-2 flex justify-between">

                                <span className="flex items-center gap-2 text-sm text-slate-300">

                                    <CheckCircle2
                                        size={16}
                                        className="text-green-400"
                                    />

                                    Open

                                </span>

                                <span className="text-sm font-semibold text-white">
                                    {jobStats.open}
                                </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/5">

                                <div
                                    className="h-full rounded-full bg-green-500 transition-all"
                                    style={{
                                        width: `${
                                            jobStats.total
                                                ? (
                                                    jobStats.open /
                                                    jobStats.total
                                                ) * 100
                                                : 0
                                        }%`,
                                    }}
                                />

                            </div>

                        </div>




                        <div>

                            <div className="mb-2 flex justify-between">

                                <span className="flex items-center gap-2 text-sm text-slate-300">

                                    <PauseCircle
                                        size={16}
                                        className="text-yellow-400"
                                    />

                                    Paused

                                </span>

                                <span className="text-sm font-semibold text-white">
                                    {jobStats.paused}
                                </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/5">

                                <div
                                    className="h-full rounded-full bg-yellow-500 transition-all"
                                    style={{
                                        width: `${
                                            jobStats.total
                                                ? (
                                                    jobStats.paused /
                                                    jobStats.total
                                                ) * 100
                                                : 0
                                        }%`,
                                    }}
                                />

                            </div>

                        </div>




                        <div>

                            <div className="mb-2 flex justify-between">

                                <span className="flex items-center gap-2 text-sm text-slate-300">

                                    <XCircle
                                        size={16}
                                        className="text-red-400"
                                    />

                                    Closed

                                </span>

                                <span className="text-sm font-semibold text-white">
                                    {jobStats.closed}
                                </span>

                            </div>

                            <div className="h-2 overflow-hidden rounded-full bg-white/5">

                                <div
                                    className="h-full rounded-full bg-red-500 transition-all"
                                    style={{
                                        width: `${
                                            jobStats.total
                                                ? (
                                                    jobStats.closed /
                                                    jobStats.total
                                                ) * 100
                                                : 0
                                        }%`,
                                    }}
                                />

                            </div>

                        </div>

                    </div>

                </div>




                <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Hiring Status
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Applications across all your jobs
                        </p>

                    </div>


                    <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">




                        <div className="flex items-center justify-center">

                            {applicationStats.total === 0 ? (

                                <div className="flex h-56 w-56 items-center justify-center rounded-full border-[28px] border-white/5">

                                    <div className="text-center">

                                        <p className="text-3xl font-bold text-white">
                                            0
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Applications
                                        </p>

                                    </div>

                                </div>

                            ) : (

                                <div
                                    className="flex h-56 w-56 items-center justify-center rounded-full"
                                    style={{
                                        background: `conic-gradient(
                                            #22c55e 0% ${
                                                (
                                                    applicationStats.accepted /
                                                    applicationStats.total
                                                ) * 100
                                            }%,

                                            #a855f7 ${
                                                (
                                                    applicationStats.accepted /
                                                    applicationStats.total
                                                ) * 100
                                            }% ${
                                                (
                                                    (
                                                        applicationStats.accepted +
                                                        applicationStats.shortlisted
                                                    ) /
                                                    applicationStats.total
                                                ) * 100
                                            }%,

                                            #eab308 ${
                                                (
                                                    (
                                                        applicationStats.accepted +
                                                        applicationStats.shortlisted
                                                    ) /
                                                    applicationStats.total
                                                ) * 100
                                            }% ${
                                                (
                                                    (
                                                        applicationStats.accepted +
                                                        applicationStats.shortlisted +
                                                        applicationStats.pending
                                                    ) /
                                                    applicationStats.total
                                                ) * 100
                                            }%,

                                            #ef4444 ${
                                                (
                                                    (
                                                        applicationStats.accepted +
                                                        applicationStats.shortlisted +
                                                        applicationStats.pending
                                                    ) /
                                                    applicationStats.total
                                                ) * 100
                                            }% 100%
                                        )`,
                                    }}
                                >

                                    <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[#111827]">

                                        <div className="text-center">

                                            <p className="text-3xl font-bold text-white">
                                                {applicationStats.total}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                Applications
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            )}

                        </div>




                        <div className="flex flex-col justify-center gap-5">

                            <StatusItem
                                label="Accepted"
                                value={
                                    applicationStats.accepted
                                }
                                color="bg-green-500"
                            />

                            <StatusItem
                                label="Shortlisted"
                                value={
                                    applicationStats.shortlisted
                                }
                                color="bg-purple-500"
                            />

                            <StatusItem
                                label="Pending"
                                value={
                                    applicationStats.pending
                                }
                                color="bg-yellow-500"
                            />

                            <StatusItem
                                label="Rejected"
                                value={
                                    applicationStats.rejected
                                }
                                color="bg-red-500"
                            />

                        </div>

                    </div>

                </div>

            </div>



            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">




                <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Applications by Job
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Jobs with the highest number of applications
                        </p>

                    </div>


                    {applicationsByJob.length === 0 ? (

                        <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10">

                            <div className="text-center">

                                <Users
                                    size={32}
                                    className="mx-auto text-slate-600"
                                />

                                <p className="mt-3 text-sm text-slate-500">
                                    No applications yet.
                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="mt-6 space-y-5">

                            {applicationsByJob.map(
                                ({
                                    job,
                                    count,
                                }) => {

                                    const percentage =
                                        (
                                            count /
                                            maxApplicationCount
                                        ) * 100;


                                    return (

                                        <div
                                            key={job._id}
                                            className="group"
                                        >

                                            <div className="mb-2 flex items-center justify-between gap-4">

                                                <p className="truncate text-sm font-medium text-slate-300">

                                                    {job.title}

                                                </p>

                                                <span className="shrink-0 text-sm font-semibold text-white">

                                                    {count}

                                                </span>

                                            </div>


                                            <div className="h-3 overflow-hidden rounded-full bg-white/5">

                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700 group-hover:from-violet-500 group-hover:to-blue-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>




                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div>

                        <h2 className="text-xl font-semibold text-white">
                            Quick Actions
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your workspace
                        </p>

                    </div>


                    <div className="mt-6 space-y-4">




                        <button
                            onClick={handlePostJob}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-500/20"
                        >

                            <Plus size={18} />

                            Post New Job

                        </button>




                        <button
                            onClick={
                                handleManageStartup
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 font-medium text-white transition hover:bg-white/5"
                        >

                            <Building2
                                size={18}
                                className="text-cyan-400"
                            />

                            Manage Startups

                        </button>




                        <button
                            onClick={
                                handleViewApplications
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-3 font-medium text-white transition hover:bg-white/5"
                        >

                            <Users
                                size={18}
                                className="text-purple-400"
                            />

                            View Applications

                        </button>

                    </div>

                </div>

            </div>


        </div>

    );
}



function StatusItem({
    label,
    value,
    color,
}) {

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">

                <span
                    className={`h-3 w-3 rounded-full ${color}`}
                />

                <span className="text-sm text-slate-300">
                    {label}
                </span>

            </div>

            <span className="text-sm font-semibold text-white">
                {value}
            </span>

        </div>

    );

}


export default Home;