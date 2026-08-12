import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api/api";

import StartupJobs from "../../components/job/StartupJobs";

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
    const [appliedJobs, setAppliedJobs] = useState([]);
    const fetchAppliedJobs = async () => {

    try {

        const response = await api.get(
            "/applications/my",
            {
                withCredentials: true,
            }
        );

        setAppliedJobs(
            response.data.data.applications
                .map((app) => app.job._id)
        );

    }

    catch (error) {

        console.log(error);

    }

};

    const fetchStartup = async () => {

        try {

            const response = await api.get(
                `/startups/${startupId}`,
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
            fetchAppliedJobs();


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

        <div className="mx-auto max-w-7xl space-y-8">

            <div className="rounded-3xl border border-white/10 bg-[#111827] p-8">

                <div className="flex flex-col justify-between gap-8 lg:flex-row">

                    <div className="flex gap-6">

                        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                            <Building2
                                size={44}
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

                                {startup.industry?.map((item) => (

                                    <span
                                        key={item}
                                        className="rounded-full bg-violet-500/20 px-3 py-1 text-sm text-violet-300"
                                    >

                                        {item}

                                    </span>

                                ))}

                            </div>

                        </div>

                    </div>

                    <span className="h-fit rounded-full bg-violet-500/20 px-4 py-2 text-sm font-semibold capitalize text-violet-300">

                        {startup.stage.replace("_", " ")}

                    </span>

                </div>

            </div>

            <div className="grid gap-6 lg:grid-cols-3">

                <div className="space-y-6 lg:col-span-2">

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <h2 className="text-2xl font-semibold text-white">

                            About Startup

                        </h2>

                        <p className="mt-5 min-h-[120px] whitespace-pre-wrap leading-8 text-slate-300">

                            {startup.description || "No description available."}

                        </p>

                    </div>

                    <div className="rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <h2 className="text-2xl font-semibold text-white">

                            Open Positions

                        </h2>

                        <div className="mt-6">

                            <StartupJobs startupId={startupId} />

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
                                        {startup.founder?.fullName || "Not Available"}
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
                                        {startup.location || "Not Available"}
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
                                            ? `₹ ${startup.fundingGoal.toLocaleString()}`
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

                    </div>

                </div>

            </div>

        </div>

    );

}

export default StartupDetails;