import { Building2, MapPin, BriefcaseBusiness } from "lucide-react";
import { useNavigate } from "react-router-dom";

function StartupJobManagerCard({ startup }) {

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

                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-sm text-purple-300">
                    {startup.stage}
                </span>

            </div>

            <div className="mt-5 flex items-center gap-2 text-slate-400">

                <MapPin size={17} />

                <span>{startup.location}</span>

            </div>

            <button
                onClick={() =>
                    navigate(
                        `/startup_builder/dashboard/my-jobs/${startup._id}`
                    )
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:cursor-pointer hover:opacity-90"
            >

                <BriefcaseBusiness size={18} />

                Manage Jobs

            </button>

        </div>
    );
}

export default StartupJobManagerCard;