import {
    Building2,
    CircleDollarSign,
    Clock3,
    TrendingUp,
    Percent,
    CalendarDays,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    getMyInvestments,
} from "../../../services/api/investor.service";

function Portfolio() {
    const navigate = useNavigate();

    const [investments, setInvestments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const fetchPortfolio = async () => {
        try {
            const response =
                await getMyInvestments();

            const data =
                response?.data?.investments ||
                [];

            setInvestments(data);
        } catch (error) {
            console.error(
                "Failed to fetch portfolio:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const acceptedInvestments =
        useMemo(
            () =>
                investments.filter(
                    (investment) =>
                        investment.status ===
                        "accepted"
                ),
            [investments]
        );

    const pendingInvestments =
        useMemo(
            () =>
                investments.filter(
                    (investment) =>
                        investment.status ===
                        "pending"
                ),
            [investments]
        );

    const totalInvested =
        acceptedInvestments.reduce(
            (total, investment) =>
                total +
                Number(
                    investment.amount || 0
                ),
            0
        );

    const averageInvestment =
        acceptedInvestments.length
            ? totalInvested /
              acceptedInvestments.length
            : 0;

    const companies =
        useMemo(() => {
            const map = new Map();

            acceptedInvestments.forEach(
                (investment) => {
                    const startup =
                        investment.startup;

                    if (!startup?._id) {
                        return;
                    }

                    const id =
                        startup._id.toString();

                    if (!map.has(id)) {
                        map.set(id, {
                            startup,
                            amount: 0,
                            count: 0,
                        });
                    }

                    const company =
                        map.get(id);

                    company.amount +=
                        Number(
                            investment.amount ||
                                0
                        );

                    company.count += 1;
                }
            );

            return Array.from(
                map.values()
            ).sort(
                (a, b) =>
                    b.amount - a.amount
            );
        }, [acceptedInvestments]);

    const industryData =
        useMemo(() => {
            const map = {};

            acceptedInvestments.forEach(
                (investment) => {
                    const industries =
                        investment.startup
                            ?.industry || [];

                    const amount =
                        Number(
                            investment.amount ||
                                0
                        );

                    if (
                        industries.length ===
                        0
                    ) {
                        map["Other"] =
                            (map["Other"] || 0) +
                            amount;

                        return;
                    }

                    industries.forEach(
                        (industry) => {
                            map[industry] =
                                (map[industry] ||
                                    0) + amount;
                        }
                    );
                }
            );

            return Object.entries(map)
                .map(
                    ([
                        name,
                        amount,
                    ]) => ({
                        name,
                        amount,
                    })
                )
                .sort(
                    (a, b) =>
                        b.amount -
                        a.amount
                );
        }, [acceptedInvestments]);

    const stageData =
        useMemo(() => {
            const map = {};

            acceptedInvestments.forEach(
                (investment) => {
                    const stage =
                        investment.startup
                            ?.stage ||
                        "Other";

                    map[stage] =
                        (map[stage] || 0) +
                        Number(
                            investment.amount ||
                                0
                        );
                }
            );

            return Object.entries(map)
                .map(
                    ([
                        stage,
                        amount,
                    ]) => ({
                        stage,
                        amount,
                    })
                )
                .sort(
                    (a, b) =>
                        b.amount -
                        a.amount
                );
        }, [acceptedInvestments]);

    const maxIndustryAmount =
        industryData.length
            ? Math.max(
                  ...industryData.map(
                      (item) =>
                          item.amount
                  )
              )
            : 0;

    const maxStageAmount =
        stageData.length
            ? Math.max(
                  ...stageData.map(
                      (item) =>
                          item.amount
                  )
              )
            : 0;

    const formatCurrency = (
        amount
    ) => {
        return `₹${Number(
            amount || 0
        ).toLocaleString("en-IN")}`;
    };

    const formatStage = (
        stage
    ) => {
        return stage
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-sm text-slate-400">
                    Loading portfolio...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div>

                <p className="text-sm font-medium text-purple-400">
                    Investment Overview
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                    Portfolio
                </h1>

                <p className="mt-2 text-slate-400">
                    Track your investments and portfolio allocation.
                </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Total Invested
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {formatCurrency(
                                    totalInvested
                                )}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-emerald-500/10 p-3">

                            <CircleDollarSign
                                size={22}
                                className="text-emerald-400"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Invested Companies
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {companies.length}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-purple-500/10 p-3">

                            <Building2
                                size={22}
                                className="text-purple-400"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Average Investment
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {formatCurrency(
                                    averageInvestment
                                )}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-blue-500/10 p-3">

                            <TrendingUp
                                size={22}
                                className="text-blue-400"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Pending Requests
                            </p>

                            <p className="mt-2 text-2xl font-bold text-white">
                                {pendingInvestments.length}
                            </p>

                        </div>

                        <div className="rounded-2xl bg-yellow-500/10 p-3">

                            <Clock3
                                size={22}
                                className="text-yellow-400"
                            />

                        </div>

                    </div>

                </div>

            </div>

            {acceptedInvestments.length ===
            0 ? (

                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827]">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">

                        <TrendingUp
                            size={28}
                            className="text-slate-500"
                        />

                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        Your portfolio is empty
                    </h2>

                    <p className="mt-2 max-w-md text-center text-sm text-slate-500">
                        Accepted investments will appear here with portfolio analytics.
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/investor/dashboard/startups"
                            )
                        }
                        className="mt-6 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                        Explore Startups
                    </button>

                </div>

            ) : (

                <>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                        <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold text-white">
                                        Investment by Industry
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Capital allocation across industries.
                                    </p>

                                </div>

                                <TrendingUp
                                    size={21}
                                    className="text-purple-400"
                                />

                            </div>

                            <div className="mt-7 space-y-5">

                                {industryData.map(
                                    (item) => {

                                        const width =
                                            maxIndustryAmount
                                                ? (item.amount /
                                                      maxIndustryAmount) *
                                                  100
                                                : 0;

                                        return (
                                            <div
                                                key={
                                                    item.name
                                                }
                                            >

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
                                                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                                                        style={{
                                                            width: `${width}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                        <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                            <div className="flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-semibold text-white">
                                        Investment by Stage
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Capital allocation across startup stages.
                                    </p>

                                </div>

                                <Percent
                                    size={21}
                                    className="text-emerald-400"
                                />

                            </div>

                            <div className="mt-7 space-y-5">

                                {stageData.map(
                                    (item) => {

                                        const width =
                                            maxStageAmount
                                                ? (item.amount /
                                                      maxStageAmount) *
                                                  100
                                                : 0;

                                        return (
                                            <div
                                                key={
                                                    item.stage
                                                }
                                            >

                                                <div className="mb-2 flex items-center justify-between">

                                                    <span className="text-sm font-medium text-slate-300">
                                                        {formatStage(
                                                            item.stage
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
                                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                                                        style={{
                                                            width: `${width}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>

                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-semibold text-white">
                                    Portfolio Companies
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your active investments by company.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        "/investor/dashboard/invested-companies"
                                    )
                                }
                                className="text-sm font-medium text-purple-400 transition hover:text-purple-300"
                            >
                                View All
                            </button>

                        </div>

                        <div className="mt-6 overflow-x-auto">

                            <table className="w-full min-w-[700px]">

                                <thead>

                                    <tr className="border-b border-white/10 text-left">

                                        <th className="pb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Company
                                        </th>

                                        <th className="pb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Stage
                                        </th>

                                        <th className="pb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Investment
                                        </th>

                                        <th className="pb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Equity
                                        </th>

                                        <th className="pb-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                                            Investments
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {companies.map(
                                        (company) => {

                                            const latest =
                                                acceptedInvestments
                                                    .filter(
                                                        (
                                                            investment
                                                        ) =>
                                                            investment
                                                                .startup
                                                                ?._id ===
                                                            company
                                                                .startup
                                                                ._id
                                                    )
                                                    .sort(
                                                        (
                                                            a,
                                                            b
                                                        ) =>
                                                            new Date(
                                                                b.createdAt
                                                            ) -
                                                            new Date(
                                                                a.createdAt
                                                            )
                                                    )[0];

                                            return (
                                                <tr
                                                    key={
                                                        company
                                                            .startup
                                                            ._id
                                                    }
                                                    onClick={() =>
                                                        navigate(
                                                            `/investor/dashboard/startups/${company.startup._id}`
                                                        )
                                                    }
                                                    className="cursor-pointer border-b border-white/5 transition hover:bg-white/[0.03]"
                                                >

                                                    <td className="py-5">

                                                        <div className="flex items-center gap-3">

                                                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600">

                                                                {company
                                                                    .startup
                                                                    .logo ? (

                                                                    <img
                                                                        src={
                                                                            company
                                                                                .startup
                                                                                .logo
                                                                        }
                                                                        alt=""
                                                                        className="h-full w-full object-cover"
                                                                    />

                                                                ) : (

                                                                    <Building2
                                                                        size={18}
                                                                        className="text-white"
                                                                    />

                                                                )}

                                                            </div>

                                                            <div>

                                                                <p className="font-medium text-white">
                                                                    {
                                                                        company
                                                                            .startup
                                                                            .name
                                                                    }
                                                                </p>

                                                                <p className="text-xs text-slate-500">
                                                                    {company
                                                                        .startup
                                                                        .industry
                                                                        ?.join(
                                                                            ", "
                                                                        ) ||
                                                                        "Industry not specified"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="py-5 text-sm capitalize text-slate-300">

                                                        {company
                                                            .startup
                                                            .stage
                                                            ?.replace(
                                                                "_",
                                                                " "
                                                            ) ||
                                                            "—"}

                                                    </td>

                                                    <td className="py-5 text-sm font-semibold text-emerald-400">

                                                        {formatCurrency(
                                                            company.amount
                                                        )}

                                                    </td>

                                                    <td className="py-5 text-sm text-slate-300">

                                                        {latest?.equityAsked ||
                                                            0}
                                                        %

                                                    </td>

                                                    <td className="py-5 text-sm text-slate-300">

                                                        {company.count}

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <div className="flex items-center gap-3">

                            <CalendarDays
                                size={21}
                                className="text-blue-400"
                            />

                            <div>

                                <h2 className="text-xl font-semibold text-white">
                                    Recent Investments
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your latest accepted investment activity.
                                </p>

                            </div>

                        </div>

                        <div className="mt-6 space-y-3">

                            {[
                                ...acceptedInvestments,
                            ]
                                .sort(
                                    (
                                        a,
                                        b
                                    ) =>
                                        new Date(
                                            b.createdAt
                                        ) -
                                        new Date(
                                            a.createdAt
                                        )
                                )
                                .slice(
                                    0,
                                    5
                                )
                                .map(
                                    (
                                        investment
                                    ) => (

                                        <div
                                            key={
                                                investment._id
                                            }
                                            className="flex flex-col gap-4 rounded-2xl bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">

                                                    <Building2
                                                        size={19}
                                                        className="text-purple-400"
                                                    />

                                                </div>

                                                <div>

                                                    <p className="font-medium text-white">

                                                        {investment
                                                            .startup
                                                            ?.name ||
                                                            "Startup"}

                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">

                                                        {investment.createdAt
                                                            ? new Date(
                                                                  investment.createdAt
                                                              ).toLocaleDateString(
                                                                  "en-IN"
                                                              )
                                                            : "Date unavailable"}

                                                    </p>

                                                </div>

                                            </div>

                                            <div className="flex items-center gap-6">

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Amount
                                                    </p>

                                                    <p className="mt-1 font-semibold text-emerald-400">

                                                        {formatCurrency(
                                                            investment.amount
                                                        )}

                                                    </p>

                                                </div>

                                                <div>

                                                    <p className="text-xs text-slate-500">
                                                        Equity
                                                    </p>

                                                    <p className="mt-1 font-semibold text-white">

                                                        {investment.equityAsked ||
                                                            0}
                                                        %

                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}

export default Portfolio;