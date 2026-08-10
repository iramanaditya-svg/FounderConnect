import {
    Building2,
    BriefcaseBusiness,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    AlertCircle,
} from "lucide-react";

import { useEffect, useState } from "react";
import axios from "axios";

function RaiseInvestment() {
    const [startups, setStartups] = useState([]);
    const [startupStates, setStartupStates] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedStartup, setSelectedStartup] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        fundingGoal: "",
        currentValuation: "",
        equityOffered: "",
        message: "",
    });

    const fetchStartups = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/startups/my-startups",
                {
                    withCredentials: true,
                }
            );

            const myStartups =
                response.data?.data?.startups || [];

            setStartups(myStartups);

            const states = {};

            await Promise.all(
                myStartups.map(async (startup) => {
                    try {
                        const jobsResponse =
                            await axios.get(
                                `http://localhost:8000/api/v1/startups/${startup._id}/jobs`,
                                {
                                    withCredentials: true,
                                }
                            );

                        const jobs =
                            jobsResponse.data?.data?.jobs ||
                            [];

                        const openJobs =
                            jobs.filter(
                                (job) =>
                                    job.status === "open"
                            );

                        let applications = [];

                        await Promise.all(
                            openJobs.map(
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
                                                ?.applications ||
                                            [];

                                        applications.push(
                                            ...jobApplications
                                        );
                                    } catch (error) {
                                        console.error(
                                            error
                                        );
                                    }
                                }
                            )
                        );

                        const activeApplications =
                            applications.filter(
                                (application) =>
                                    [
                                        "pending",
                                        "shortlisted",
                                    ].includes(
                                        application.status
                                    )
                            );

                        states[startup._id] = {
                            jobs,
                            openJobs,
                            applications,
                            activeApplications,
                            hiringActive:
                                openJobs.length > 0,
                        };
                    } catch (error) {
                        console.error(
                            `Failed to fetch hiring data for ${startup._id}`,
                            error
                        );

                        states[startup._id] = {
                            jobs: [],
                            openJobs: [],
                            applications: [],
                            activeApplications: [],
                            hiringActive: false,
                        };
                    }
                })
            );

            setStartupStates(states);
        } catch (error) {
            console.error(
                "Failed to fetch startups:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartups();
    }, []);

    const handleSelect = (startup) => {
        const state =
            startupStates[startup._id];

        if (state?.hiringActive) {
            return;
        }

        setSelectedStartup(startup);

        setFormData({
            fundingGoal:
                startup.fundingGoal || "",
            currentValuation:
                startup.currentValuation || "",
            equityOffered:
                startup.equityOffered || "",
            message: "",
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStartup) {
            return;
        }

        const state =
            startupStates[selectedStartup._id];

        if (state?.hiringActive) {
            alert(
                "You cannot raise investment while hiring is active."
            );
            return;
        }

        if (!formData.fundingGoal) {
            alert(
                "Please enter your funding goal."
            );
            return;
        }

        if (!formData.equityOffered) {
            alert(
                "Please enter the equity offered."
            );
            return;
        }

        try {
            setSubmitting(true);

            await axios.patch(
                `http://localhost:8000/api/v1/startups/${selectedStartup._id}`,
                {
                    fundingGoal:
                        Number(
                            formData.fundingGoal
                        ),
                    currentValuation:
                        formData.currentValuation
                            ? Number(
                                  formData.currentValuation
                              )
                            : undefined,
                    equityOffered:
                        Number(
                            formData.equityOffered
                        ),
                    openToInvestors: true,
                },
                {
                    withCredentials: true,
                }
            );

            alert(
                "Investment raising has been enabled for this startup."
            );

            setSelectedStartup(null);

            await fetchStartups();
        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                    "Failed to enable investment raising."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-slate-400">
                    Loading your startups...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div>
                <p className="text-sm font-medium text-emerald-400">
                    Fundraising
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                    Raise Investment
                </h1>

                <p className="mt-2 max-w-2xl text-slate-400">
                    Choose a startup to open it for investors. A startup cannot raise investment while it is actively hiring.
                </p>
            </div>

            <div className="rounded-3xl border border-yellow-500/20 bg-yellow-500/5 p-5">

                <div className="flex gap-4">

                    <AlertCircle
                        size={22}
                        className="mt-0.5 shrink-0 text-yellow-400"
                    />

                    <div>

                        <h3 className="font-semibold text-yellow-300">
                            One activity at a time
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-yellow-400/70">
                            Startups with an open job cannot raise investment. Close the active hiring first, then investment raising can be enabled.
                        </p>

                    </div>

                </div>

            </div>

            {startups.length === 0 ? (

                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827]">

                    <Building2
                        size={32}
                        className="text-slate-600"
                    />

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        No startups found
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Create a startup first to raise investment.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {startups.map((startup) => {

                        const state =
                            startupStates[
                                startup._id
                            ];

                        const hiringActive =
                            state?.hiringActive;

                        const alreadyRaising =
                            startup.openToInvestors ===
                            true;

                        return (
                            <div
                                key={startup._id}
                                className="rounded-3xl border border-white/10 bg-[#111827] p-6"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600">

                                            {startup.logo ? (
                                                <img
                                                    src={
                                                        startup.logo
                                                    }
                                                    alt={
                                                        startup.name
                                                    }
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Building2
                                                    size={25}
                                                    className="text-white"
                                                />
                                            )}

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-semibold text-white">
                                                {startup.name}
                                            </h2>

                                            <p className="mt-1 text-sm capitalize text-slate-500">
                                                {startup.stage?.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                    {alreadyRaising && (
                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                                            Raising
                                        </span>
                                    )}

                                </div>

                                {startup.tagline && (
                                    <p className="mt-5 text-sm leading-6 text-slate-400">
                                        {startup.tagline}
                                    </p>
                                )}

                                <div className="my-6 h-px bg-white/5" />

                                <div className="grid grid-cols-2 gap-3">

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <BriefcaseBusiness
                                                size={16}
                                                className="text-blue-400"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Open Jobs
                                            </span>

                                        </div>

                                        <p className="mt-2 text-xl font-semibold text-white">
                                            {state?.openJobs
                                                ?.length || 0}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <Clock3
                                                size={16}
                                                className="text-yellow-400"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Active Applications
                                            </span>

                                        </div>

                                        <p className="mt-2 text-xl font-semibold text-white">
                                            {state
                                                ?.activeApplications
                                                ?.length || 0}
                                        </p>

                                    </div>

                                </div>

                                {hiringActive ? (

                                    <div className="mt-5 rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4">

                                        <div className="flex gap-3">

                                            <BriefcaseBusiness
                                                size={19}
                                                className="mt-0.5 shrink-0 text-orange-400"
                                            />

                                            <div>

                                                <p className="text-sm font-semibold text-orange-300">
                                                    Hiring is currently active
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-orange-400/70">
                                                    Close all open jobs before raising investment.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ) : alreadyRaising ? (

                                    <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                                        <div className="flex gap-3">

                                            <CheckCircle2
                                                size={19}
                                                className="mt-0.5 shrink-0 text-emerald-400"
                                            />

                                            <div>

                                                <p className="text-sm font-semibold text-emerald-300">
                                                    Investment raising is active
                                                </p>

                                                <p className="mt-1 text-xs leading-5 text-emerald-400/70">
                                                    This startup is currently open to investors.
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                ) : (

                                    <button
                                        onClick={() =>
                                            handleSelect(
                                                startup
                                            )
                                        }
                                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20"
                                    >

                                        <CircleDollarSign
                                            size={18}
                                        />

                                        Raise Investment

                                    </button>

                                )}

                            </div>
                        );
                    })}

                </div>

            )}

            {selectedStartup && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0F172A] p-8">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-emerald-400">
                                    Investment Setup
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-white">
                                    {selectedStartup.name}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Set the terms you want to offer investors.
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedStartup(
                                        null
                                    )
                                }
                                className="text-slate-400 hover:text-white"
                            >
                                ✕
                            </button>

                        </div>

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="mt-8 space-y-6"
                        >

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Funding Goal
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    name="fundingGoal"
                                    value={
                                        formData.fundingGoal
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter funding goal"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Current Valuation
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="currentValuation"
                                    value={
                                        formData.currentValuation
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter current valuation"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Equity Offered
                                </label>

                                <div className="relative">

                                    <input
                                        type="number"
                                        min="0.01"
                                        max="100"
                                        step="0.01"
                                        name="equityOffered"
                                        value={
                                            formData.equityOffered
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter equity percentage"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-white outline-none focus:border-emerald-500"
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                                        %
                                    </span>

                                </div>

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Message
                                </label>

                                <textarea
                                    rows={4}
                                    name="message"
                                    value={
                                        formData.message
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Tell investors about your fundraising round..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-500"
                                />

                            </div>

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedStartup(
                                            null
                                        )
                                    }
                                    className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-slate-300 hover:bg-white/5"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Opening..."
                                        : "Start Raising"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default RaiseInvestment;