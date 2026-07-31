import {
    MapPin,
    Globe,
    Pencil,
    Trash2,
    Building2,
} from "lucide-react";

function StartupCard({ startup }) {
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
                    {startup.stage.replace("_", " ")}
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

            <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">

                <div>

                    <p className="text-xs text-slate-500">
                        Funding Goal
                    </p>

                    <h3 className="text-lg font-bold text-white">
                        ₹ {startup.fundingGoal || 0}
                    </h3>

                </div>

                <div className="flex gap-3">

                    <button className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-violet-600 hover:text-white">
                        <Pencil size={18} />
                    </button>

                    <button className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-red-600 hover:text-white">
                        <Trash2 size={18} />
                    </button>

                </div>

            </div>

        </div>
    );
}

export default StartupCard;