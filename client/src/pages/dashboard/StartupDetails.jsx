import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StartupJobs from "../../components/job/StartupJobs";
import axios from "axios";
import {
    Building2,
    MapPin,
    Globe,
    CircleDollarSign,
    User,
} from "lucide-react";

function StartupDetails() {

    const { startupId } = useParams();

    const [startup, setStartup] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStartup = async () => {
        try {

            const response = await axios.get(
                `http://localhost:8000/api/v1/startups/${startupId}`,
                {
                    withCredentials: true,
                }
            );

            setStartup(response.data.data);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartup();
    }, [startupId]);

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

    return (
        <div className="mx-auto max-w-6xl space-y-8">

            {/* Hero */}

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-8">

                <div className="flex flex-col justify-between gap-8 lg:flex-row">

                    <div className="flex gap-6">

                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                            <Building2
                                size={45}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <h1 className="text-4xl font-bold text-white">
                                {startup.name}
                            </h1>

                            <p className="mt-3 text-lg text-slate-400">
                                {startup.tagline}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-2">

                                {startup.industry?.map((item) => (
                                    <span
                                        key={item}
                                        className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300"
                                    >
                                        {item}
                                    </span>
                                ))}

                            </div>

                        </div>

                    </div>

                    <span className="h-fit rounded-full bg-purple-500/20 px-4 py-2 text-purple-300">
                        {startup.stage}
                    </span>

                </div>

            </div>

            {/* Details */}

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="space-y-6 lg:col-span-2">

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                        <h2 className="text-2xl font-semibold text-white">
                            About Startup
                        </h2>
                                
                        <p className="mt-5 leading-8 text-slate-300">
                            {startup.description}
                        </p>

                    </div>
                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

    <h2 className="text-2xl font-semibold text-white">
        Open Positions
    </h2>

    <div className="mt-6">

        <StartupJobs startupId={startupId} />

    </div>

</div>

                </div>

                <div>

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                        <h2 className="text-xl font-semibold text-white">
                            Startup Information
                        </h2>

                        <div className="mt-6 space-y-5">

                            <div className="flex items-center gap-3">

                                <User className="text-slate-400" />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Founder
                                    </p>

                                    <p className="text-white">
                                        {startup.founder?.fullName}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <MapPin className="text-slate-400" />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Location
                                    </p>

                                    <p className="text-white">
                                        {startup.location}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <CircleDollarSign className="text-slate-400" />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Funding Goal
                                    </p>

                                    <p className="text-white">
                                        ₹
                                        {startup.fundingGoal
                                            ? startup.fundingGoal.toLocaleString()
                                            : "Not Specified"}
                                    </p>

                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <Globe className="text-slate-400" />

                                <div>

                                    <p className="text-sm text-slate-500">
                                        Website
                                    </p>

                                    <a
                                        href={startup.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        {startup.website || "Not Available"}
                                    </a>

                                </div>

                            </div>

                        </div>

                        <button className="mt-8 w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:opacity-90">
                            Apply Now
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default StartupDetails;