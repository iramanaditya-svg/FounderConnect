import api from "../../services/api/api";
import {
    Pencil,
    Trash2,
    MapPin,
    Briefcase,
    Laptop,
    Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EditJobModal from "./EditJobModal";
function JobCard({ job, onRefresh }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {

        const confirmed = window.confirm(
            `Delete "${job.title}"?`
        );

        if (!confirmed) return;

        try {

            await api.delete(
                `/jobs/${job._id}`,
                {
                    withCredentials: true,
                }
            );

            await onRefresh();

        } catch (error) {

            console.log(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete job."
            );

        }

    };

    return (

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 transition hover:border-violet-500 hover:shadow-xl hover:shadow-violet-500/10">

            <div className="flex items-start justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <h2 className="text-2xl font-bold text-white">
                            {job.title}
                        </h2>

                        <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold capitalize text-green-400">
                            {job.status}
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

                    <h3 className="text-xl font-bold text-green-400">

                        ₹{job.minSalary?.toLocaleString()} - ₹{job.maxSalary?.toLocaleString()}

                    </h3>

                    <p className="mt-2 text-sm text-slate-400">
                        {job.numberOfOpenings} Opening(s)
                    </p>

                </div>

            </div>

            <div className="mt-6 border-t border-slate-800 pt-5">

    <div className="flex items-center justify-between">

        <div>

            <p className="text-sm text-slate-500">
                Experience
            </p>

            <p className="font-semibold capitalize text-white">
                {job.experienceLevel.replace("_", " - ")}
            </p>

        </div>

        <button
            onClick={() =>
                navigate(
                    `/startup_builder/dashboard/my-jobs/${job._id}/applicants`
                )
            }
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >

            <Users size={18} />

            View Applicants

        </button>

    </div>

    <div className="mt-5 flex justify-end gap-3">

        <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-violet-600 hover:text-white"
        >

            <Pencil size={18} />

        </button>

        <EditJobModal
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            job={job}
            onSuccess={onRefresh}
        />

        <button
            onClick={handleDelete}
            className="rounded-xl bg-slate-800 p-3 text-slate-300 transition hover:bg-red-600 hover:text-white"
        >

            <Trash2 size={18} />

        </button>

    </div>

</div>

        </div>

    );

}

export default JobCard;