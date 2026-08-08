import {
    MapPin,
    Briefcase,
    Laptop,
    IndianRupee,
} from "lucide-react";
import { useState } from "react";


import ApplyJobModal from "../application/ApplyJobModal";
function StartupJobCard({
    job,
    alreadyApplied,
    onApplied,
}) {
    const [isApplyOpen, setIsApplyOpen] = useState(false);

    return (

        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 transition hover:border-violet-500/40">

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-bold text-white">
                            {job.title}
                        </h2>

                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-400">
                            Open
                        </span>

                    </div>

                    <div className="mt-4 flex flex-wrap gap-5 text-sm text-slate-400">

                        <div className="flex items-center gap-2">

                            <Briefcase size={16} />

                            <span className="capitalize">
                                {job.employmentType.replace("_", " ")}
                            </span>

                        </div>

                        <div className="flex items-center gap-2">

                            <Laptop size={16} />

                            <span className="capitalize">
                                {job.workMode.replace("_", " ")}
                            </span>

                        </div>

                        <div className="flex items-center gap-2">

                            <MapPin size={16} />

                            <span>
                                {job.location}
                            </span>

                        </div>

                    </div>

                </div>

                <div className="text-right">

                    <div className="flex items-center justify-end gap-1 text-xl font-bold text-green-400">

                        <IndianRupee size={18} />

                        {job.minSalary?.toLocaleString()} -
                        {job.maxSalary?.toLocaleString()}

                    </div>

                    <p className="mt-2 text-sm text-slate-400">

                        {job.numberOfOpenings} Opening(s)

                    </p>

                </div>

            </div>

            <div className="mt-6 border-t border-white/10 pt-5">

                <p className="text-sm text-slate-500">

                    Experience

                </p>

                <p className="mt-1 font-semibold capitalize text-white">

                    {job.experienceLevel.replace("_", " - ")}

                </p>

            </div>

            {job.requiredSkills?.length > 0 && (

                <div className="mt-5 flex flex-wrap gap-2">

                    {job.requiredSkills.map((skill) => (

                        <span
                            key={skill}
                            className="rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-300"
                        >
                            {skill}
                        </span>

                    ))}

                </div>

            )}
        <div className="mt-6 border-t border-white/10 pt-6">

{
    alreadyApplied ? (

        <button
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-green-600 py-3 font-semibold text-white"
        >
            ✓ Applied
        </button>

    ) : (

        <button
onClick={() => setIsApplyOpen(true)}
            className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:opacity-90"
        >
            Apply Now
        </button>

    )
}

</div>

<ApplyJobModal
    open={isApplyOpen}
    onClose={() => setIsApplyOpen(false)}
    job={job}
    onSuccess={onApplied}
/>
        </div>

    );

}

export default StartupJobCard;