import {
    Building2,
    BriefcaseBusiness,
    CircleDollarSign,
    Percent,
    CalendarDays,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyInvestments } from "../../../services/api/investor.service";

function InvestedCompanies() {
    const navigate = useNavigate();

    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvestments = async () => {
            try {
                const response = await getMyInvestments();

                const allInvestments =
                    response?.data?.investments || [];

                setInvestments(
                    allInvestments.filter(
                        (investment) =>
                            investment.status === "accepted"
                    )
                );
            } catch (error) {
                console.error(
                    "Failed to fetch invested companies:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInvestments();
    }, []);

    const companies = useMemo(() => {
        const companyMap = new Map();

        investments.forEach((investment) => {
            const startup = investment.startup;

            if (!startup?._id) {
                return;
            }

            const startupId = startup._id.toString();

            if (!companyMap.has(startupId)) {
                companyMap.set(startupId, {
                    startup,
                    totalInvested: 0,
                    investmentCount: 0,
                    investments: [],
                });
            }

            const company = companyMap.get(startupId);

            company.totalInvested +=
                Number(investment.amount || 0);

            company.investmentCount += 1;

            company.investments.push(investment);
        });

        return Array.from(companyMap.values()).sort(
            (a, b) =>
                b.totalInvested - a.totalInvested
        );
    }, [investments]);

    const totalInvested = companies.reduce(
        (total, company) =>
            total + company.totalInvested,
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
                    Loading invested companies...
                </p>

            </div>
        );
    }

    return (
        <div className="space-y-8">

            <div>

                <p className="text-sm font-medium text-emerald-400">
                    Portfolio
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                    Invested Companies
                </h1>

                <p className="mt-2 text-slate-400">
                    Companies currently backed by your investments.
                </p>

            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Invested Companies
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-white">
                                {companies.length}
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

            </div>

            {companies.length === 0 ? (

                <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827]">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">

                        <Building2
                            size={28}
                            className="text-slate-500"
                        />

                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-white">
                        No invested companies
                    </h2>

                    <p className="mt-2 max-w-md text-center text-sm text-slate-500">
                        Companies will appear here after your investment requests are accepted.
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

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                    {companies.map((company) => {

                        const startup =
                            company.startup;

                        const latestInvestment =
                            company.investments[
                                company.investments.length - 1
                            ];

                        return (
                            <div
                                key={startup._id}
                                className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-white/20"
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                                            <Building2
                                                size={25}
                                                className="text-white"
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-lg font-semibold text-white">
                                                {startup.name}
                                            </h2>

                                            <p className="mt-1 text-sm capitalize text-slate-500">
                                                {startup.stage?.replace(
                                                    "_",
                                                    " "
                                                ) ||
                                                    "Stage not specified"}
                                            </p>

                                        </div>

                                    </div>

                                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                        Invested
                                    </span>

                                </div>

                                {startup.tagline && (
                                    <p className="mt-5 line-clamp-2 text-sm leading-6 text-slate-400">
                                        {startup.tagline}
                                    </p>
                                )}

                                <div className="my-6 h-px bg-white/5" />

                                <div className="grid grid-cols-2 gap-3">

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <CircleDollarSign
                                                size={16}
                                                className="text-emerald-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Total Invested
                                            </p>

                                        </div>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {formatCurrency(
                                                company.totalInvested
                                            )}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <BriefcaseBusiness
                                                size={16}
                                                className="text-blue-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Investments
                                            </p>

                                        </div>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {company.investmentCount}
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <Percent
                                                size={16}
                                                className="text-purple-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Latest Equity
                                            </p>

                                        </div>

                                        <p className="mt-2 text-lg font-semibold text-white">
                                            {latestInvestment?.equityAsked ||
                                                0}
                                            %
                                        </p>

                                    </div>

                                    <div className="rounded-2xl bg-white/[0.03] p-4">

                                        <div className="flex items-center gap-2">

                                            <CalendarDays
                                                size={16}
                                                className="text-cyan-400"
                                            />

                                            <p className="text-xs text-slate-500">
                                                Latest Investment
                                            </p>

                                        </div>

                                        <p className="mt-2 text-sm font-semibold text-white">
                                            {latestInvestment?.createdAt
                                                ? new Date(
                                                      latestInvestment.createdAt
                                                  ).toLocaleDateString(
                                                      "en-IN"
                                                  )
                                                : "—"}
                                        </p>

                                    </div>

                                </div>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/investor/dashboard/startups/${startup._id}`
                                        )
                                    }
                                    className="mt-5 flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                                >
                                    View Company
                                </button>

                            </div>
                        );
                    })}

                </div>

            )}

        </div>
    );
}

export default InvestedCompanies;