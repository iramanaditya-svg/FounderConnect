import {
    Building2,
    CheckCircle2,
    XCircle,
    CircleDollarSign,
    Percent,
    User,
    MessageCircle,
    Clock3,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import api from "../../../services/api/api";

import {
    getStartupInvestmentRequests,
    updateInvestmentStatus,
} from "../../../services/api/investment.service";

function InvestmentRequests() {

    const [startups, setStartups] =
        useState([]);

    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [updating, setUpdating] =
        useState(null);

    const fetchRequests = async () => {

        try {

            const startupResponse =
                await api.get(
                    "/startups/my-startups",
                    {
                        withCredentials: true,
                    }
                );

            const myStartups =
                startupResponse.data?.data
                    ?.startups || [];

            setStartups(myStartups);

            const allRequests = [];

            await Promise.all(
                myStartups.map(
                    async (startup) => {

                        try {

                            const response =
                                await getStartupInvestmentRequests(
                                    startup._id
                                );

                            const startupRequests =
                                response?.data
                                    ?.investments ||
                                [];

                            startupRequests.forEach(
                                (investment) => {

                                    allRequests.push({
                                        ...investment,
                                        startup,
                                    });

                                }
                            );

                        } catch (error) {

                            console.error(
                                error
                            );

                        }

                    }
                )
            );

            allRequests.sort(
                (a, b) =>
                    new Date(
                        b.createdAt
                    ) -
                    new Date(
                        a.createdAt
                    )
            );

            setRequests(
                allRequests
            );

        } catch (error) {

            console.error(
                "Failed to fetch investment requests:",
                error
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchRequests();

    }, []);

    const handleStatusUpdate = async (
        investmentId,
        status
    ) => {

        try {

            setUpdating(
                investmentId
            );

            await updateInvestmentStatus(
                investmentId,
                status
            );

            await fetchRequests();

        } catch (error) {

            console.error(
                error
            );

            alert(
                error.response?.data
                    ?.message ||
                `Failed to ${status} investment request.`
            );

        } finally {

            setUpdating(null);

        }

    };

    const pendingRequests =
        requests.filter(
            (request) =>
                request.status ===
                "pending"
        );

    const processedRequests =
        requests.filter(
            (request) =>
                request.status !==
                "pending"
        );

    if (loading) {

        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <p className="text-sm text-slate-400">
                    Loading investment requests...
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
                    Investment Requests
                </h1>

                <p className="mt-2 text-slate-400">
                    Review investors who are interested in funding your startups.
                </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <p className="text-sm text-slate-400">
                        Total Requests
                    </p>

                    <p className="mt-2 text-3xl font-bold text-white">
                        {requests.length}
                    </p>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <p className="text-sm text-slate-400">
                        Pending
                    </p>

                    <p className="mt-2 text-3xl font-bold text-yellow-400">
                        {pendingRequests.length}
                    </p>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <p className="text-sm text-slate-400">
                        Accepted
                    </p>

                    <p className="mt-2 text-3xl font-bold text-emerald-400">

                        {
                            requests.filter(
                                (request) =>
                                    request.status ===
                                    "accepted"
                            ).length
                        }

                    </p>

                </div>

            </div>

            {pendingRequests.length ===
            0 ? (

                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827]">

                    <Clock3
                        size={32}
                        className="text-slate-600"
                    />

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        No pending investment requests
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        New investor requests will appear here.
                    </p>

                </div>

            ) : (

                <div className="space-y-5">

                    {pendingRequests.map(
                        (request) => (

                            <div
                                key={
                                    request._id
                                }
                                className="rounded-3xl border border-white/10 bg-[#111827] p-6"
                            >

                                <div className="flex flex-col justify-between gap-6 lg:flex-row">

                                    <div className="flex gap-5">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500">

                                            <User
                                                size={25}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-semibold text-white">

                                                {request.investor
                                                    ?.fullName ||
                                                    request.investor
                                                        ?.username ||
                                                    "Investor"}

                                            </h2>

                                            <p className="mt-1 text-sm text-slate-500">

                                                Interested in{" "}

                                                <span className="text-purple-400">

                                                    {request.startup
                                                        ?.name ||
                                                        "Your Startup"}

                                                </span>

                                            </p>

                                        </div>

                                    </div>

                                    <span className="flex h-fit items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-xs font-semibold text-yellow-400">

                                        <Clock3
                                            size={14}
                                        />

                                        Pending

                                    </span>

                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <CircleDollarSign
                                                size={17}
                                                className="text-emerald-400"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Investment
                                            </span>

                                        </div>

                                        <p className="mt-2 text-xl font-semibold text-white">

                                            ₹
                                            {Number(
                                                request.amount ||
                                                    0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <Percent
                                                size={17}
                                                className="text-purple-400"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Equity Asked
                                            </span>

                                        </div>

                                        <p className="mt-2 text-xl font-semibold text-white">

                                            {request.equityAsked ||
                                                0}
                                            %

                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <Building2
                                                size={17}
                                                className="text-blue-400"
                                            />

                                            <span className="text-xs text-slate-500">
                                                Startup
                                            </span>

                                        </div>

                                        <p className="mt-2 truncate text-sm font-semibold text-white">

                                            {request.startup
                                                ?.name ||
                                                "Startup"}

                                        </p>

                                    </div>

                                </div>

                                {request.message && (

                                    <div className="mt-5 rounded-2xl bg-white/[0.03] p-5">

                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Investor Message
                                        </p>

                                        <p className="mt-2 text-sm leading-6 text-slate-300">
                                            {request.message}
                                        </p>

                                    </div>

                                )}

                                <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">

                                    <button
                                        disabled={
                                            updating ===
                                            request._id
                                        }
                                        onClick={() =>
                                            handleStatusUpdate(
                                                request._id,
                                                "accepted"
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        <CheckCircle2
                                            size={18}
                                        />

                                        {updating ===
                                        request._id
                                            ? "Updating..."
                                            : "Accept Investment"}

                                    </button>

                                    <button
                                        disabled={
                                            updating ===
                                            request._id
                                        }
                                        onClick={() =>
                                            handleStatusUpdate(
                                                request._id,
                                                "rejected"
                                            )
                                        }
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 py-3 font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        <XCircle
                                            size={18}
                                        />

                                        Reject

                                    </button>

                                    <button
                                        onClick={() => {
                                            window.location.href =
                                                `/startup_builder/dashboard/connections?user=${request.investor?._id}`;
                                        }}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                                    >

                                        <MessageCircle
                                            size={18}
                                        />

                                        Contact Investor

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

            {processedRequests.length >
                0 && (

                <div>

                    <h2 className="mb-5 text-xl font-semibold text-white">
                        Previous Requests
                    </h2>

                    <div className="space-y-3">

                        {processedRequests.map(
                            (request) => (

                                <div
                                    key={
                                        request._id
                                    }
                                    className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#111827] p-5 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    <div>

                                        <p className="font-medium text-white">

                                            {request.investor
                                                ?.fullName ||
                                                "Investor"}

                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">

                                            {request.startup
                                                ?.name ||
                                                "Startup"}

                                        </p>

                                    </div>

                                    <div className="flex items-center gap-5">

                                        <div>

                                            <p className="text-xs text-slate-500">
                                                Amount
                                            </p>

                                            <p className="mt-1 font-semibold text-white">

                                                ₹
                                                {Number(
                                                    request.amount ||
                                                        0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}

                                            </p>

                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                request.status ===
                                                "accepted"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}
                                        >
                                            {
                                                request.status
                                            }
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}

        </div>

    );
}

export default InvestmentRequests;