import {
    Building2,
    MapPin,
    CircleDollarSign,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import axios from "axios";

function InvestorStartups() {

    const navigate = useNavigate();

    const [startups, setStartups] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

const fetchStartups = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8000/api/v1/startups",
            {
                withCredentials: true,
            }
        );

        const availableStartups =
            (response.data.data.startups || []).filter(
                (startup) =>
                    startup.openToInvestors === true &&
                    startup.status === "active"
            );

        setStartups(availableStartups);

    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {

        fetchStartups();

    }, []);

    if (loading) {

        return (

            <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-[#111827] text-slate-400">

                Loading Startups...

            </div>

        );

    }

    if (startups.length === 0) {

        return (

            <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827] text-slate-500">

                No startups available.

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <div>

                <p className="text-sm font-medium text-purple-400">
                    Discover
                </p>

                <h1 className="mt-2 text-3xl font-bold text-white">
                    Startups
                </h1>

                <p className="mt-2 text-slate-400">
                    Discover startups and explore investment opportunities.
                </p>

            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                {startups.map(
                    (startup) => (

                        <div
                            key={startup._id}
                            className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40"
                        >

                            <div className="flex items-start justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

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
                                                size={30}
                                                className="text-white"
                                            />

                                        )}

                                    </div>

                                    <div>

                                        <h2 className="text-xl font-bold text-white">
                                            {startup.name}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-400">
                                            {startup.tagline}
                                        </p>

                                    </div>

                                </div>

                                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium capitalize text-purple-300">

                                    {startup.stage?.replace(
                                        "_",
                                        " "
                                    )}

                                </span>

                            </div>

                            <div className="mt-6 flex flex-wrap gap-2">

                                {startup.industry?.map(
                                    (item) => (

                                        <span
                                            key={item}
                                            className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                                        >
                                            {item}
                                        </span>

                                    )
                                )}

                            </div>

                            <div className="mt-6 space-y-3">

                                <div className="flex items-center gap-2 text-slate-400">

                                    <MapPin size={17} />

                                    <span>
                                        {startup.location}
                                    </span>

                                </div>

                                <div className="flex items-center gap-2 text-slate-400">

                                    <CircleDollarSign
                                        size={17}
                                    />

                                    <span>

                                        ₹
                                        {startup.fundingGoal
                                            ? startup.fundingGoal.toLocaleString(
                                                  "en-IN"
                                              )
                                            : "Not specified"}

                                    </span>

                                </div>

                            </div>

                            <div className="mt-6 border-t border-white/10 pt-4">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Founded by
                                        </p>

                                        <h3 className="mt-1 font-semibold text-white">
                                            {startup.founder?.fullName}
                                        </h3>

                                    </div>

                                    {startup.openToInvestors && (

                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                            Raising
                                        </span>

                                    )}

                                </div>

                            </div>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/investor/dashboard/startups/${startup._id}`
                                    )
                                }
                                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:cursor-pointer hover:opacity-90"
                            >
                                View Investment Opportunity
                            </button>

                        </div>

                    )
                )}

            </div>

        </div>

    );

}

export default InvestorStartups;