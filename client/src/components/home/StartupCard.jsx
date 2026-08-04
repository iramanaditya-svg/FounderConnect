import { Building2, MapPin, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StartupCard({ startup, onDelete }) {

    const navigate = useNavigate();

    return (
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-[#7C3AED]/40">


            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                        <Building2
                            size={28}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            {startup.name}
                        </h2>

                        <p className="mt-1 text-slate-400">
                            {startup.tagline}
                        </p>

                    </div>

                </div>

                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
                    {startup.stage}
                </span>

            </div>


            <div className="mt-5 flex flex-wrap gap-2">

                {startup.industry?.map((item) => (

                    <span
                        key={item}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                    >
                        {item}
                    </span>

                ))}

            </div>


            <div className="mt-5 flex items-center gap-2 text-slate-400">

                <MapPin size={17} />

                <span>{startup.location}</span>

            </div>


            <div className="mt-6 border-t border-white/10 pt-5">

                <p className="text-sm text-slate-500">
                    Funding Goal
                </p>

                <h3 className="mt-1 text-2xl font-bold text-white">

                    ₹ {startup.fundingGoal?.toLocaleString() || 0}

                </h3>

            </div>


            <div className="mt-6 flex items-center justify-end gap-3">

                <button
                    onClick={() =>
                        navigate(
                            `/startup_builder/dashboard/my-startups/${startup._id}`
                        )
                    }
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F2937] transition hover:cursor-pointer hover:bg-[#2563EB]"
                >

                    <Pencil
                        size={18}
                        className="text-white"
                    />

                </button>

                <button
                    onClick={() => onDelete(startup._id)}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F2937] transition hover:cursor-pointer hover:bg-red-600"
                >

                    <Trash2
                        size={18}
                        className="text-white"
                    />

                </button>

            </div>

        </div>
    );
}

export default StartupCard;