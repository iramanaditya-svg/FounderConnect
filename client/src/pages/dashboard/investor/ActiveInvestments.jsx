import {
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    CircleDollarSign,
    Percent,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyInvestments } from "../../../services/api/investor.service";

function ActiveInvestments() {
    const navigate = useNavigate();

    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await getMyInvestments();

                const allInvestments =
                    response?.data?.investments || [];

                const activeInvestments =
                    allInvestments.filter(
                        (investment) =>
                            investment.status === "accepted"
                    );

                setInvestments(activeInvestments);
            } catch (error) {
                console.error(
                    "Failed to fetch active investments:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const totalInvested = investments.reduce(
        (total, investment) =>
            total + Number(investment.amount || 0),
        0
    );

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString(
            "en-IN"
        )}`;
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">

                <p className="text-sm text-slate-400">
                    Loading active investments...
                </p>

            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div>

                <p className="text-sm font-medium text-purple-400">
                    Portfolio
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                    Active Investments
                </h1>

                <p className="mt-2 text-slate-400">
                    Track the startups you have invested in.
                </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Active Investments
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-white">
                                {investments.length}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-blue-500/10 p-4">

                            <BriefcaseBusiness
                                size={24}
                                className="text-blue-400"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Total Invested
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-white">
                                {formatCurrency(totalInvested)}
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-emerald-500/10 p-4">

                            <CircleDollarSign
                                size={24}
                                className="text-emerald-400"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Companies
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-white">
                                {
                                    new Set(
                                        investments
                                            .map(
                                                (investment) =>
                                                    investment
                                                        .startup?._id
                                            )
                                            .filter(Boolean)
                                    ).size
                                }
                            </h2>

                        </div>

                        <div className="rounded-2xl bg-purple-500/10 p-4">

                            <Building2
                                size={24}
                                className="text-purple-400"
                            />

                        </div>

                    </div>

                </div>

            </div>

            {investments.length === 0 ? (

                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827]">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">

                        <BriefcaseBusiness
                            size={28}
                            className="text-slate-500"
                        />

                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        No active investments
                    </h2>

                    <p className="mt-2 max-w-md text-center text-sm text-slate-500">
                        You don't have any accepted investments yet.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/investor/dashboard/startups"
                            )
                        }
                        className="mt-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                        Explore Startups
                    </button>

                </div>

            ) : (

                <div className="space-y-5">

                    {investments.map((investment) => {

                        const startup =
                            investment.startup;

                        return (
                            <div
                                key={investment._id}
                                className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-white/20"
                            >

                                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                                            <Building2
                                                size={25}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-semibold text-white">
                                                {startup?.name ||
                                                    "Startup"}
                                            </h2>

                                            <p className="mt-1 text-sm capitalize text-slate-500">
                                                {startup?.stage?.replace(
                                                    "_",
                                                    " "
                                                ) ||
                                                    "Stage not specified"}
                                            </p>

                                        </div>

                                    </div>

                                    <span className="w-fit rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold capitalize text-emerald-400">
                                        {investment.status}
                                    </span>

                                </div>

                                <div className="my-6 h-px bg-white/5" />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <CircleDollarSign
                                                size={17}
                                                className="text-emerald-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Investment
                                            </p>

                                        </div>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {formatCurrency(
                                                investment.amount
                                            )}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <Percent
                                                size={17}
                                                className="text-purple-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Equity Asked
                                            </p>

                                        </div>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {investment.equityAsked || 0}%
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <CalendarDays
                                                size={17}
                                                className="text-blue-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Invested On
                                            </p>

                                        </div>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {investment.createdAt
                                                ? new Date(
                                                      investment.createdAt
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : "—"}
                                        </p>

                                    </div>

                                    <div className="flex items-end">

                                        <button
                                            onClick={() =>
                                                startup?._id &&
                                                navigate(
                                                    `/investor/dashboard/startups/${startup._id}`
                                                )
                                            }
                                            className="w-full rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                                        >
                                            View Startup
                                        </button>

                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default ActiveInvestments;