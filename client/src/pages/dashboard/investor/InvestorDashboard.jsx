import { useEffect, useMemo, useState } from "react";
import {
    ArrowUpRight,
    BarChart3,
    Building2,
    CircleDollarSign,
    Clock3,
    IndianRupee,
    Layers3,
    TrendingUp,
} from "lucide-react";

import {
    getMyInvestments,
} from "../../../services/api/investor.service";

function formatCurrency(value) {
    if (!value) {
        return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
}

function InvestorDashboard() {
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response =
                    await getMyInvestments();

                setInvestments(
                    response?.data?.investments || []
                );
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const analytics = useMemo(() => {
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

        const pendingCapital =
            pending.reduce(
                (total, investment) =>
                    total +
                    Number(investment.amount || 0),
                0
            );

        const industryMap = {};

        accepted.forEach((investment) => {
            const industries =
                investment.startup?.industry || [];

            industries.forEach((industry) => {
                industryMap[industry] =
                    (industryMap[industry] || 0) +
                    Number(investment.amount || 0);
            });
        });

        const stageMap = {};

        accepted.forEach((investment) => {
            const stage =
                investment.startup?.stage ||
                "Unknown";

            stageMap[stage] =
                (stageMap[stage] || 0) +
                Number(investment.amount || 0);
        });

        const companyMap = {};

        accepted.forEach((investment) => {
            const startup =
                investment.startup;

            if (!startup?._id) {
                return;
            }

            const id = startup._id;

            if (!companyMap[id]) {
                companyMap[id] = {
                    startup,
                    amount: 0,
                    count: 0,
                };
            }

            companyMap[id].amount +=
                Number(investment.amount || 0);

            companyMap[id].count += 1;
        });

        const investedCompanies =
            Object.values(companyMap).sort(
                (a, b) =>
                    b.amount - a.amount
            );

        const industryBreakdown =
            Object.entries(industryMap)
                .map(
                    ([name, amount]) => ({
                        name,
                        amount,
                    })
                )
                .sort(
                    (a, b) =>
                        b.amount - a.amount
                );

        const stageBreakdown =
            Object.entries(stageMap)
                .map(
                    ([name, amount]) => ({
                        name,
                        amount,
                    })
                )
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
                                  investment.amount ||
                                      0
                              )
                      )
                  )
                : 0;

        return {
            accepted,
            pending,
            rejected,
            totalFundInvested,
            pendingCapital,
            industryBreakdown,
            stageBreakdown,
            investedCompanies,
            averageInvestment,
            largestInvestment,
        };
    }, [investments]);

    const maxIndustryValue =
        analytics.industryBreakdown.length
            ? Math.max(
                  ...analytics.industryBreakdown.map(
                      (item) => item.amount
                  )
              )
            : 1;

    const maxStageValue =
        analytics.stageBreakdown.length
            ? Math.max(
                  ...analytics.stageBreakdown.map(
                      (item) => item.amount
                  )
              )
            : 1;

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-slate-400">
                    Loading investor dashboard...
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">

                <div>
                    <p className="text-sm font-medium text-purple-400">
                        Investor Workspace
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-white">
                        Welcome back,{" "}
                        {user?.fullName ||
                            user?.username ||
                            "Investor"}
                        !
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Track your portfolio,
                        investments and startup
                        opportunities.
                    </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#111827] px-5 py-3">
                    <p className="text-xs text-slate-500">
                        Portfolio Status
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

                        <span className="text-sm font-medium text-white">
                            Active
                        </span>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-purple-500/10 p-3">
                            <IndianRupee className="h-6 w-6 text-purple-400" />
                        </div>

                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                        Total Fund Invested
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                        {formatCurrency(
                            analytics.totalFundInvested
                        )}
                    </h2>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-blue-500/10 p-3">
                            <Clock3 className="h-6 w-6 text-blue-400" />
                        </div>

                        <span className="text-xs font-medium text-yellow-400">
                            Pending
                        </span>
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                        Pending Capital
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                        {formatCurrency(
                            analytics.pendingCapital
                        )}
                    </h2>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-cyan-500/10 p-3">
                            <Layers3 className="h-6 w-6 text-cyan-400" />
                        </div>

                        <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                        Active Investments
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                        {analytics.accepted.length}
                    </h2>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">
                        <div className="rounded-2xl bg-emerald-500/10 p-3">
                            <Building2 className="h-6 w-6 text-emerald-400" />
                        </div>

                        <span className="text-xs text-slate-500">
                            Companies
                        </span>
                    </div>

                    <p className="mt-6 text-sm text-slate-400">
                        Invested Companies
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                        {analytics.investedCompanies.length}
                    </h2>

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
                                Where your capital is currently allocated
                            </p>
                        </div>

                        <BarChart3 className="h-5 w-5 text-purple-400" />

                    </div>

                    <div className="mt-8 space-y-5">

                        {analytics.industryBreakdown.length === 0 ? (
                            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">
                                <p className="text-sm text-slate-500">
                                    No investment data available yet.
                                </p>
                            </div>
                        ) : (
                            analytics.industryBreakdown
                                .slice(0, 7)
                                .map((item) => (
                                    <div key={item.name}>

                                        <div className="mb-2 flex items-center justify-between">

                                            <span className="text-sm font-medium text-slate-300">
                                                {item.name}
                                            </span>

                                            <span className="text-sm font-semibold text-white">
                                                {formatCurrency(
                                                    item.amount
                                                )}
                                            </span>

                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-white/5">

                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]"
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
                                Portfolio Overview
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Your investment activity
                            </p>
                        </div>

                        <CircleDollarSign className="h-5 w-5 text-purple-400" />

                    </div>

                    <div className="mt-8 space-y-5">

                        <div className="rounded-2xl bg-white/[0.03] p-4">
                            <p className="text-xs text-slate-500">
                                Average Investment
                            </p>

                            <p className="mt-2 text-lg font-semibold text-white">
                                {formatCurrency(
                                    analytics.averageInvestment
                                )}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/[0.03] p-4">
                            <p className="text-xs text-slate-500">
                                Largest Investment
                            </p>

                            <p className="mt-2 text-lg font-semibold text-white">
                                {formatCurrency(
                                    analytics.largestInvestment
                                )}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/[0.03] p-4">
                            <p className="text-xs text-slate-500">
                                Investment Requests
                            </p>

                            <p className="mt-2 text-lg font-semibold text-white">
                                {investments.length}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-white/[0.03] p-4">
                            <p className="text-xs text-slate-500">
                                Rejected Requests
                            </p>

                            <p className="mt-2 text-lg font-semibold text-white">
                                {analytics.rejected.length}
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
                                Capital distribution across startup stages
                            </p>
                        </div>

                        <Layers3 className="h-5 w-5 text-blue-400" />

                    </div>

                    <div className="mt-8 space-y-5">

                        {analytics.stageBreakdown.length === 0 ? (
                            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">
                                <p className="text-sm text-slate-500">
                                    No stage data available yet.
                                </p>
                            </div>
                        ) : (
                            analytics.stageBreakdown.map(
                                (item) => (
                                    <div key={item.name}>

                                        <div className="mb-2 flex items-center justify-between">

                                            <span className="text-sm font-medium capitalize text-slate-300">
                                                {item.name.replace(
                                                    "_",
                                                    " "
                                                )}
                                            </span>

                                            <span className="text-sm font-semibold text-white">
                                                {formatCurrency(
                                                    item.amount
                                                )}
                                            </span>

                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-white/5">

                                            <div
                                                className="h-full rounded-full bg-gradient-to-r from-[#06B6D4] to-[#2563EB]"
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
                                Your highest-value portfolio companies
                            </p>
                        </div>

                        <Building2 className="h-5 w-5 text-emerald-400" />

                    </div>

                    <div className="mt-6 space-y-3">

                        {analytics.investedCompanies.length === 0 ? (
                            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10">
                                <p className="text-sm text-slate-500">
                                    No invested companies yet.
                                </p>
                            </div>
                        ) : (
                            analytics.investedCompanies
                                .slice(0, 5)
                                .map((item) => (
                                    <div
                                        key={item.startup._id}
                                        className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                                    >

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-white">
                                                    {item.startup.name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {item.startup.stage?.replace(
                                                        "_",
                                                        " "
                                                    )}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="text-right">

                                            <p className="font-semibold text-white">
                                                {formatCurrency(
                                                    item.amount
                                                )}
                                            </p>

                                            <p className="text-xs text-slate-500">
                                                {item.count}{" "}
                                                investment
                                                {item.count !== 1
                                                    ? "s"
                                                    : ""}
                                            </p>

                                        </div>

                                    </div>
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
                            Latest investment requests and decisions
                        </p>
                    </div>

                    <TrendingUp className="h-5 w-5 text-purple-400" />

                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-white/5">

                    {investments.length === 0 ? (
                        <div className="flex h-40 items-center justify-center">
                            <p className="text-sm text-slate-500">
                                You haven't made any investment requests yet.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">

                            {investments
                                .slice(0, 6)
                                .map((investment) => (
                                    <div
                                        key={investment._id}
                                        className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
                                    >

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                                                <Building2 className="h-5 w-5 text-purple-400" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-white">
                                                    {investment.startup?.name ||
                                                        "Startup"}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {new Date(
                                                        investment.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </p>
                                            </div>

                                        </div>

                                        <div className="flex items-center gap-6">

                                            <div className="text-right">
                                                <p className="font-semibold text-white">
                                                    {formatCurrency(
                                                        investment.amount
                                                    )}
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
                                                        : "bg-red-500/10 text-red-400"
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

        </div>
    );
}

export default InvestorDashboard;