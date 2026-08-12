import api from "../../services/api/api";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Globe,
    Pencil,
    Trash2,
    Building2,
    Users,
} from "lucide-react";

function StartupCard({
    startup,
    onRefresh,
    onOpenToInvestors,
}) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        const confirmed = window.confirm(
            `Delete ${startup.name}?`
        );

        if (!confirmed) return;

        try {
            await api.delete(
                `/startups/${startup._id}`,
                {
                    withCredentials: true,
                }
            );

            await onRefresh();
        } catch (error) {
            console.log(error);
            alert("Failed to delete startup.");
        }
    };

    return (
        <div className="rounded-3xl border border-slate-800 bg-[#0F172A] p-6 transition duration-300 hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10">

            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20">
                        <Building2
                            size={28}
                            className="text-violet-500"
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white">
                            {startup.name}
                        </h2>

                        <p className="text-sm text-slate-400">
                            {startup.tagline || "No tagline added"}
                        </p>
                    </div>

                </div>

                <span className="rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold capitalize text-violet-400">
                    {startup.stage?.replace("_", " ")}
                </span>

            </div>

            <p className="mt-5 line-clamp-3 text-sm text-slate-300">
                {startup.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

                {startup.industry?.map((item) => (
                    <span
                        key={item}
                        className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300"
                    >
                        {item}
                    </span>
                ))}

            </div>

            <div className="mt-6 space-y-3 text-sm text-slate-400">

                <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {startup.location}
                </div>

                {startup.website && (
                    <div className="flex items-center gap-2">
                        <Globe size={16} />

                        <a
                            href={startup.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 hover:underline"
                        >
                            Website
                        </a>
                    </div>
                )}

            </div>

            <div className="mt-6 border-t border-slate-800 pt-5">

                <div className="flex items-center justify-between">

                    <div>
                        <p className="text-xs text-slate-500">
                            Funding Goal
                        </p>

                        <h3 className="text-lg font-bold text-white">
                            ₹ {startup.fundingGoal || 0}
                        </h3>
                    </div>

                    <div className="flex gap-3">

                        <button
                            onClick={() =>
                                onOpenToInvestors(startup)
                            }
                            title={
                                startup.openToInvestors
                                    ? "Close to Investors"
                                    : "Open to Investors"
                            }
                            className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                startup.openToInvestors
                                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                    : "bg-slate-800 text-slate-300 hover:bg-emerald-600 hover:text-white"
                            }`}
                        >
                            <Users size={18} />

                            {startup.openToInvestors
                                ? "Open"
                                : "Investors"}
                        </button>

                        <button
                            onClick={() =>
                                navigate(
                                    `/startup_builder/dashboard/my-startups/${startup._id}`
                                )
                            }
                            className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-violet-600 hover:text-white"
                        >
                            <Pencil size={18} />
                        </button>

                        <button
                            onClick={handleDelete}
                            className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-red-600 hover:text-white"
                        >
                            <Trash2 size={18} />
                        </button>

                    </div>

                </div>

                {startup.openToInvestors && (
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        This startup is open to investors
                    </div>
                )}

            </div>

        </div>
    );
}

export default StartupCard;