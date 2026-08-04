import { Building2, MapPin, CircleDollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
function StartupFeedCard({ startup }) {
    const navigate = useNavigate();
    return (
        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#7C3AED]/40">


            <div className="flex items-start justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                        <Building2
                            size={30}
                            className="text-white"
                        />

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

                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm font-medium text-purple-300">
                    {startup.stage}
                </span>

            </div>


            <div className="mt-6 flex flex-wrap gap-2">

                {startup.industry?.map((item) => (
                    <span
                        key={item}
                        className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300"
                    >
                        {item}
                    </span>
                ))}

            </div>


            <div className="mt-6 space-y-3">

                <div className="flex items-center gap-2 text-slate-400">

                    <MapPin size={17} />

                    <span>{startup.location}</span>

                </div>

                <div className="flex items-center gap-2 text-slate-400">

                    <CircleDollarSign size={17} />

                    <span>
                        ₹
                        {startup.fundingGoal
                            ? startup.fundingGoal.toLocaleString()
                            : "Not specified"}
                    </span>

                </div>

            </div>


            <div className="mt-6 border-t border-white/10 pt-4">

                <p className="text-sm text-slate-400">
                    Founded by
                </p>

                <h3 className="mt-1 font-semibold text-white">
                    {startup.founder?.fullName}
                </h3>

            </div>


<button
    onClick={() =>
        navigate(
            `/professional/dashboard/startups/${startup._id}`
        )
    }
    className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:cursor-pointer hover:opacity-90"
>
    View Startup
</button>

        </div>
    );
}

export default StartupFeedCard;