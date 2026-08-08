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
    BarChart3,
    CircleDollarSign,
    ArrowUpRight,
    Target,
    TrendingUp,
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

        const [investments, setInvestments] =
            useState([]);

        const [investmentsLoading, setInvestmentsLoading] =
            useState(true);

        useEffect(() => {

            const fetchInvestments = async () => {

                try {

                    const response =
                        await axios.get(
                            "http://localhost:8000/api/v1/investments/my",
                            {
                                withCredentials: true,
                            }
                        );

                    setInvestments(
                        response.data?.data?.investments || []
                    );

                } catch (error) {

                    console.error(
                        "Failed to fetch investments:",
                        error
                    );

                } finally {

                    setInvestmentsLoading(false);

                }

            };

            fetchInvestments();

        }, []);

        const investorAnalytics = useMemo(() => {

            const accepted =
                investments.filter(
                    (investment) =>
                        investment.status === "accepted"
                );

            const pending =
                investments.filter(
                    (investment) =>
                        investment.status === "pending"
                );

            const rejected =
                investments.filter(
                    (investment) =>
                        investment.status === "rejected"
                );

            const totalFundInvested =
                accepted.reduce(
                    (total, investment) =>
                        total +
                        Number(investment.amount || 0),
                    0
                );

            const industryMap = {};
            const stageMap = {};
            const companyMap = {};

            accepted.forEach((investment) => {

                const amount =
                    Number(investment.amount || 0);

                const industries =
                    investment.startup?.industry || [];

                industries.forEach((industry) => {
                    industryMap[industry] =
                        (industryMap[industry] || 0) +
                        amount;
                });

                const stage =
                    investment.startup?.stage ||
                    "unknown";

                stageMap[stage] =
                    (stageMap[stage] || 0) +
                    amount;

                const startup =
                    investment.startup;

                if (startup?._id) {

                    const id =
                        startup._id.toString();

                    if (!companyMap[id]) {
                        companyMap[id] = {
                            startup,
                            amount: 0,
                            count: 0,
                        };
                    }

                    companyMap[id].amount += amount;
                    companyMap[id].count += 1;

                }

            });

            const investedCompanies =
                Object.values(companyMap).sort(
                    (a, b) =>
                        b.amount - a.amount
                );

            const industryBreakdown =
                Object.entries(industryMap)
                    .map(([name, amount]) => ({
                        name,
                        amount,
                    }))
                    .sort(
                        (a, b) =>
                            b.amount - a.amount
                    );

            const stageBreakdown =
                Object.entries(stageMap)
                    .map(([name, amount]) => ({
                        name,
                        amount,
                    }))
                    .sort(
                        (a, b) =>
                            b.amount - a.amount
                    );

            const averageInvestment =
                accepted.length
                    ? totalFundInvested /
                      accepted.length
                    : 0;

            const largestInvestment =
                accepted.length
                    ? Math.max(
                          ...accepted.map(
                              (investment) =>
                                  Number(
                                      investment.amount || 0
                                  )
                          )
                      )
                    : 0;

            return {
                accepted,
                pending,
                rejected,
                totalFundInvested,
                investedCompanies,
                industryBreakdown,
                stageBreakdown,
                averageInvestment,
                largestInvestment,
            };

        }, [investments]);

        const maxIndustryValue =
            investorAnalytics.industryBreakdown.length
                ? Math.max(
                      ...investorAnalytics.industryBreakdown.map(
                          (item) => item.amount
                      )
                  )
                : 1;

        const maxStageValue =
            investorAnalytics.stageBreakdown.length
                ? Math.max(
                      ...investorAnalytics.stageBreakdown.map(
                          (item) => item.amount
                      )
                  )
                : 1;

        return (

            <div className="space-y-8">

                <WelcomeBanner />

                {investmentsLoading ? (

                    <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-[#111827]">

                        <p className="text-sm text-slate-400">
                            Loading investments...
                        </p>

                    </div>

                ) : (

                    <>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Total Fund Invested
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-white">
                                            ₹{investorAnalytics.totalFundInvested.toLocaleString("en-IN")}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-purple-500/10 p-4">

                                        <CircleDollarSign
                                            size={25}
                                            className="text-purple-400"
                                        />

                                    </div>

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Accepted investments
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Active Investments
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-white">
                                            {investorAnalytics.accepted.length}
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
                                    Currently invested
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Invested Companies
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-white">
                                            {investorAnalytics.investedCompanies.length}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-green-500/10 p-4">

                                        <Building2
                                            size={25}
                                            className="text-green-400"
                                        />

                                    </div>

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Unique portfolio companies
                                </p>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Investment Requests
                                        </p>

                                        <h2 className="mt-3 text-3xl font-bold text-white">
                                            {investments.length}
                                        </h2>

                                    </div>

                                    <div className="rounded-2xl bg-yellow-500/10 p-4">

                                        <Clock3
                                            size={25}
                                            className="text-yellow-400"
                                        />

                                    </div>

                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Total requests made
                                </p>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                            <div className="xl:col-span-2 rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold text-white">
                                            Investment by Industry
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Accepted investment allocation across industries
                                        </p>

                                    </div>

                                    <BarChart3
                                        size={20}
                                        className="text-purple-400"
                                    />

                                </div>

                                <div className="mt-8 space-y-5">

                                    {investorAnalytics.industryBreakdown.length === 0 ? (

                                        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">

                                            <p className="text-sm text-slate-500">
                                                No accepted investments yet.
                                            </p>

                                        </div>

                                    ) : (

                                        investorAnalytics.industryBreakdown
                                            .slice(0, 8)
                                            .map((item) => (

                                                <div key={item.name}>

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-sm font-medium text-slate-300">
                                                            {item.name}
                                                        </span>

                                                        <span className="text-sm font-semibold text-white">
                                                            ₹{item.amount.toLocaleString("en-IN")}
                                                        </span>

                                                    </div>

                                                    <div className="h-3 overflow-hidden rounded-full bg-white/5">

                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                                                            style={{
                                                                width: `${Math.max(
                                                                    5,
                                                                    (item.amount /
                                                                        maxIndustryValue) *
                                                                        100
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            ))

                                    )}

                                </div>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold text-white">
                                            Portfolio Summary
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Current investment overview
                                        </p>

                                    </div>

                                    <Target
                                        size={20}
                                        className="text-cyan-400"
                                    />

                                </div>

                                <div className="mt-7 space-y-4">

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <p className="text-xs text-slate-500">
                                            Average Investment
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            ₹{investorAnalytics.averageInvestment.toLocaleString("en-IN")}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <p className="text-xs text-slate-500">
                                            Largest Investment
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            ₹{investorAnalytics.largestInvestment.toLocaleString("en-IN")}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <p className="text-xs text-slate-500">
                                            Pending Requests
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {investorAnalytics.pending.length}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <p className="text-xs text-slate-500">
                                            Rejected Requests
                                        </p>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {investorAnalytics.rejected.length}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold text-white">
                                            Investment by Stage
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Accepted investment allocation
                                        </p>

                                    </div>

                                    <TrendingUp
                                        size={20}
                                        className="text-blue-400"
                                    />

                                </div>

                                <div className="mt-8 space-y-5">

                                    {investorAnalytics.stageBreakdown.length === 0 ? (

                                        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">

                                            <p className="text-sm text-slate-500">
                                                No accepted investments yet.
                                            </p>

                                        </div>

                                    ) : (

                                        investorAnalytics.stageBreakdown.map(
                                            (item) => (

                                                <div key={item.name}>

                                                    <div className="mb-2 flex items-center justify-between">

                                                        <span className="text-sm font-medium capitalize text-slate-300">
                                                            {item.name.replace("_", " ")}
                                                        </span>

                                                        <span className="text-sm font-semibold text-white">
                                                            ₹{item.amount.toLocaleString("en-IN")}
                                                        </span>

                                                    </div>

                                                    <div className="h-3 overflow-hidden rounded-full bg-white/5">

                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                                            style={{
                                                                width: `${Math.max(
                                                                    5,
                                                                    (item.amount /
                                                                        maxStageValue) *
                                                                        100
                                                                )}%`,
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            )
                                        )

                                    )}

                                </div>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <h2 className="text-xl font-semibold text-white">
                                            Invested Companies
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Companies currently in your portfolio
                                        </p>

                                    </div>

                                    <Building2
                                        size={20}
                                        className="text-green-400"
                                    />

                                </div>

                                <div className="mt-6 space-y-3">

                                    {investorAnalytics.investedCompanies.length === 0 ? (

                                        <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">

                                            <p className="text-sm text-slate-500">
                                                No invested companies yet.
                                            </p>

                                        </div>

                                    ) : (

                                        investorAnalytics.investedCompanies
                                            .slice(0, 5)
                                            .map((item) => (

                                                <button
                                                    key={item.startup._id}
                                                    onClick={() =>
                                                        navigate(
                                                            `/investor/dashboard/startups/${item.startup._id}`
                                                        )
                                                    }
                                                    className="flex w-full items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-left transition hover:bg-white/[0.05]"
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">

                                                            <Building2
                                                                size={19}
                                                                className="text-white"
                                                            />

                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-white">
                                                                {item.startup.name}
                                                            </p>

                                                            <p className="mt-1 text-xs capitalize text-slate-500">
                                                                {item.startup.stage?.replace(
                                                                    "_",
                                                                    " "
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <div className="text-right">

                                                        <p className="font-semibold text-white">
                                                            ₹{item.amount.toLocaleString("en-IN")}
                                                        </p>

                                                        <p className="text-xs text-slate-500">
                                                            {item.count} investment
                                                            {item.count !== 1 ? "s" : ""}
                                                        </p>

                                                    </div>

                                                    <ArrowUpRight
                                                        size={16}
                                                        className="ml-3 text-slate-500"
                                                    />

                                                </button>

                                            ))

                                    )}

                                </div>

                            </div>

                        </div>

                        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold text-white">
                                        Recent Investment Activity
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Your latest investment requests
                                    </p>

                                </div>

                                <Clock3
                                    size={20}
                                    className="text-purple-400"
                                />

                            </div>

                            <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">

                                {investments.length === 0 ? (

                                    <div className="flex h-40 items-center justify-center">

                                        <p className="text-sm text-slate-500">
                                            No investment requests yet.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="divide-y divide-white/5">

                                        {investments
                                            .slice(0, 6)
                                            .map((investment) => (

                                                <div
                                                    key={investment._id}
                                                    className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
                                                >

                                                    <div className="flex items-center gap-4">

                                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">

                                                            <Building2
                                                                size={18}
                                                                className="text-purple-400"
                                                            />

                                                        </div>

                                                        <div>

                                                            <p className="font-semibold text-white">
                                                                {investment.startup?.name ||
                                                                    "Startup"}
                                                            </p>

                                                            <p className="mt-1 text-xs text-slate-500">
                                                                {investment.createdAt
                                                                    ? new Date(
                                                                          investment.createdAt
                                                                      ).toLocaleDateString(
                                                                          "en-IN"
                                                                      )
                                                                    : ""}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <div className="flex items-center gap-6">

                                                        <div className="text-right">

                                                            <p className="font-semibold text-white">
                                                                ₹{Number(
                                                                    investment.amount || 0
                                                                ).toLocaleString("en-IN")}
                                                            </p>

                                                            <p className="text-xs text-slate-500">
                                                                {investment.equityAsked}%
                                                                equity
                                                            </p>

                                                        </div>

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                                investment.status ===
                                                                "accepted"
                                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                                    : investment.status ===
                                                                      "pending"
                                                                    ? "bg-yellow-500/10 text-yellow-400"
                                                                    : investment.status ===
                                                                      "rejected"
                                                                    ? "bg-red-500/10 text-red-400"
                                                                    : "bg-slate-500/10 text-slate-400"
                                                            }`}
                                                        >
                                                            {investment.status}
                                                        </span>

                                                    </div>

                                                </div>

                                            ))}

                                    </div>

                                )}

                            </div>

                        </div>

                    </>

                )}

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



            <div className="grid grid-cols-1 gap-6 xl:grid-cols">


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




                        <div className="flex flex-col justify-center gap-5 ">

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

                <span className="text-xl font-semibold text-slate-300">
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