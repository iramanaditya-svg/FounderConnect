import {
    Building2,
    MapPin,
    Globe,
    CircleDollarSign,
    User,
    TrendingUp,
    Percent,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useParams,
    useNavigate,
} from "react-router-dom";

import api from "../../../services/api/api";

import {
    createInvestmentRequest,
    getMyInvestments,
} from "../../../services/api/investor.service";

function InvestorStartupDetails() {

    const { startupId } = useParams();

    const navigate = useNavigate();

    const [startup, setStartup] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [investments, setInvestments] =
        useState([]);

    const [showInvestModal, setShowInvestModal] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [formData, setFormData] =
        useState({
            amount: "",
            equityAsked: "",
            message: "",
        });

    const fetchStartup = async () => {

        try {

            const response =
                await api.get(
                    `/startups/${startupId}`,
                    {
                        withCredentials: true,
                    }
                );

            setStartup(
                response.data.data
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const fetchInvestments = async () => {

        try {

            const response =
                await getMyInvestments();

            setInvestments(
                response?.data?.investments || []
            );

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchStartup();
        fetchInvestments();

    }, [startupId]);

    const existingInvestment =
        investments.find(
            (investment) =>
                investment.startup?._id ===
                startupId &&
                [
                    "pending",
                    "accepted",
                ].includes(
                    investment.status
                )
        );

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.amount) {

            alert(
                "Please enter the investment amount."
            );

            return;

        }

        if (!formData.equityAsked) {

            alert(
                "Please enter the equity you are asking for."
            );

            return;

        }

        try {

            setSubmitting(true);

            await createInvestmentRequest(
                startupId,
                {
                    amount:
                        Number(
                            formData.amount
                        ),
                    equityAsked:
                        Number(
                            formData.equityAsked
                        ),
                    message:
                        formData.message,
                }
            );

            alert(
                "Investment request sent successfully."
            );

            setShowInvestModal(false);

            setFormData({
                amount: "",
                equityAsked: "",
                message: "",
            });

            await fetchInvestments();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to send investment request."
            );

        } finally {

            setSubmitting(false);

        }

    };

    if (loading) {

        return (

            <div className="flex h-96 items-center justify-center text-xl text-slate-400">

                Loading Startup...

            </div>

        );

    }

    if (!startup) {

        return (

            <div className="flex h-96 items-center justify-center text-xl text-red-400">

                Startup not found.

            </div>

        );

    }

    const canInvest =
        startup.status === "active" &&
        startup.openToInvestors &&
        !existingInvestment;

    return (

        <div className="mx-auto max-w-7xl space-y-8">

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-8">

                <div className="flex flex-col justify-between gap-8 lg:flex-row">

                    <div className="flex gap-6">

                        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                            {startup.logo ? (

                                <img
                                    src={startup.logo}
                                    alt={startup.name}
                                    className="h-full w-full object-cover"
                                />

                            ) : (

                                <Building2
                                    size={44}
                                    className="text-white"
                                />

                            )}

                        </div>

                        <div>

                            <h1 className="text-4xl font-bold text-white">

                                {startup.name}

                            </h1>

                            <p className="mt-3 text-lg text-slate-400">

                                {startup.tagline}

                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-400">

                                <div className="flex items-center gap-2">

                                    <MapPin size={16} />

                                    {startup.location}

                                </div>

                                {startup.website && (

                                    <a
                                        href={startup.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-2 text-blue-400 transition hover:underline"
                                    >

                                        <Globe size={16} />

                                        Visit Website

                                    </a>

                                )}

                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">

                                {startup.industry?.map(
                                    (item) => (

                                        <span
                                            key={item}
                                            className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300"
                                        >
                                            {item}
                                        </span>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">

                        <span className="rounded-full bg-violet-500/20 px-4 py-2 text-sm font-semibold capitalize text-violet-300">

                            {startup.stage.replace(
                                "_",
                                " "
                            )}

                        </span>

                        {startup.openToInvestors ? (

                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">

                                Open to Investors

                            </span>

                        ) : (

                            <span className="rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400">

                                Not Raising

                            </span>

                        )}

                    </div>

                </div>

            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="space-y-6 lg:col-span-2">

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <h2 className="text-2xl font-semibold text-white">

                            About Startup

                        </h2>

                        <p className="mt-5 min-h-[120px] whitespace-pre-wrap leading-8 text-slate-300">

                            {startup.description ||
                                "No description available."}

                        </p>

                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <div className="flex items-center justify-between">

                            <div>

                                <h2 className="text-2xl font-semibold text-white">

                                    Investment Opportunity

                                </h2>

                                <p className="mt-2 text-sm text-slate-500">

                                    Review the startup's fundraising details.

                                </p>

                            </div>

                            <TrendingUp
                                size={24}
                                className="text-emerald-400"
                            />

                        </div>

                        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">

                            <div className="rounded-2xl bg-white/[0.03] p-5">

                                <div className="flex items-center gap-2">

                                    <CircleDollarSign
                                        size={17}
                                        className="text-emerald-400"
                                    />

                                    <p className="text-xs text-slate-500">
                                        Funding Goal
                                    </p>

                                </div>

                                <p className="mt-3 text-xl font-semibold text-white">

                                    {startup.fundingGoal
                                        ? `₹${startup.fundingGoal.toLocaleString(
                                              "en-IN"
                                          )}`
                                        : "Not Specified"}

                                </p>

                            </div>

                            <div className="rounded-2xl bg-white/[0.03] p-5">

                                <div className="flex items-center gap-2">

                                    <CircleDollarSign
                                        size={17}
                                        className="text-blue-400"
                                    />

                                    <p className="text-xs text-slate-500">
                                        Valuation
                                    </p>

                                </div>

                                <p className="mt-3 text-xl font-semibold text-white">

                                    {startup.currentValuation
                                        ? `₹${startup.currentValuation.toLocaleString(
                                              "en-IN"
                                          )}`
                                        : "Not Specified"}

                                </p>

                            </div>

                            <div className="rounded-2xl bg-white/[0.03] p-5">

                                <div className="flex items-center gap-2">

                                    <Percent
                                        size={17}
                                        className="text-purple-400"
                                    />

                                    <p className="text-xs text-slate-500">
                                        Equity Offered
                                    </p>

                                </div>

                                <p className="mt-3 text-xl font-semibold text-white">

                                    {startup.equityOffered
                                        ? `${startup.equityOffered}%`
                                        : "Not Specified"}

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                <div>

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <h2 className="text-2xl font-semibold text-white">

                            Startup Information

                        </h2>

                        <div className="mt-8 space-y-7">

                            <div className="flex items-start gap-4">

                                <User
                                    className="mt-1 text-slate-400"
                                    size={20}
                                />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Founder
                                    </p>

                                    <p className="mt-1 font-medium text-white">

                                        {startup.founder?.fullName ||
                                            "Not Available"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <MapPin
                                    className="mt-1 text-slate-400"
                                    size={20}
                                />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Location
                                    </p>

                                    <p className="mt-1 font-medium text-white">

                                        {startup.location ||
                                            "Not Available"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <CircleDollarSign
                                    className="mt-1 text-slate-400"
                                    size={20}
                                />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Funding Goal
                                    </p>

                                    <p className="mt-1 font-medium text-white">

                                        {startup.fundingGoal
                                            ? `₹ ${startup.fundingGoal.toLocaleString(
                                                  "en-IN"
                                              )}`
                                            : "Not Specified"}

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <Globe
                                    className="mt-1 text-slate-400"
                                    size={20}
                                />

                                <div className="min-w-0">

                                    <p className="text-sm text-slate-500">
                                        Website
                                    </p>

                                    {startup.website ? (

                                        <a
                                            href={startup.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="block truncate font-medium text-blue-400 transition hover:underline"
                                        >
                                            Visit Website ↗
                                        </a>

                                    ) : (

                                        <p className="mt-1 font-medium text-white">
                                            Not Available
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>

                        <div className="mt-8 border-t border-white/10 pt-7">

                            {existingInvestment ? (

                                <div className="rounded-2xl bg-yellow-500/10 p-5">

                                    <p className="font-semibold text-yellow-400">

                                        {existingInvestment.status ===
                                        "accepted"
                                            ? "You are already invested in this startup."
                                            : "Investment request already sent."}

                                    </p>

                                    <p className="mt-2 text-sm text-yellow-400/70">

                                        Check your investment section for details.

                                    </p>

                                </div>

                            ) : startup.openToInvestors &&
                              startup.status ===
                                  "active" ? (

                                <button
                                    onClick={() =>
                                        setShowInvestModal(
                                            true
                                        )
                                    }
                                    className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20"
                                >
                                    Invest in Startup
                                </button>

                            ) : (

                                <div className="rounded-2xl bg-white/[0.03] p-5">

                                    <p className="font-semibold text-slate-300">
                                        Investment is currently unavailable.
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        This startup is not currently accepting investment requests.
                                    </p>

                                </div>

                            )}

                        </div>

                    </div>

                </div>

            </div>

            {showInvestModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0F172A] p-8 shadow-2xl">

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-sm font-medium text-emerald-400">
                                    Investment Request
                                </p>

                                <h2 className="mt-2 text-2xl font-bold text-white">
                                    Invest in {startup.name}
                                </h2>

                                <p className="mt-2 text-sm text-slate-500">
                                    Send your investment proposal to the founder.
                                </p>

                            </div>

                            <button
                                onClick={() =>
                                    setShowInvestModal(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >

                                <X size={20} />

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
                                    Investment Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    min="1"
                                    value={
                                        formData.amount
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter amount in INR"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                                />

                            </div>

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-300">
                                    Equity Asked
                                </label>

                                <div className="relative">

                                    <input
                                        type="number"
                                        name="equityAsked"
                                        min="0.01"
                                        max="100"
                                        step="0.01"
                                        value={
                                            formData.equityAsked
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter equity percentage"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white outline-none transition focus:border-emerald-500"
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
                                    name="message"
                                    rows={5}
                                    value={
                                        formData.message
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Introduce yourself and explain why you are interested in investing..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-500"
                                />

                            </div>

                            <div className="flex gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowInvestModal(
                                            false
                                        )
                                    }
                                    className="flex-1 rounded-xl border border-white/10 py-3 font-medium text-slate-300 transition hover:bg-white/5"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        submitting
                                    }
                                    className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 py-3 font-semibold text-white transition hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {submitting
                                        ? "Sending..."
                                        : "Send Investment Request"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
}

export default InvestorStartupDetails;