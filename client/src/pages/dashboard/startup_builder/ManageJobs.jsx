import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Plus } from "lucide-react";
import JobCard from "../../../components/job/JobCard";

import PostJobModal from "../../../components/job/PostJobModal";

function ManageJobs() {

const { startupId } = useParams();
const [isModalOpen, setIsModalOpen] = useState(false);

const [startup, setStartup] = useState(null);
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);


const fetchData = async () => {
    setLoading(true);

    try {

        const [startupRes, jobsRes] = await Promise.all([

            axios.get(
                `http://localhost:8000/api/v1/startups/${startupId}`,
                {
                    withCredentials: true,
                }
            ),

            axios.get(
                `http://localhost:8000/api/v1/startups/${startupId}/jobs`,
                {
                    withCredentials: true,
                }
            )

        ]);

        setStartup(startupRes.data.data.startup);

        setJobs(
            jobsRes.data.data.jobs || []
        );

    } catch (error) {

        console.log(error);

    } finally {

        setLoading(false);

    }

};

useEffect(() => {

    fetchData();

}, []);
if (loading) {

    return (

        <div className="flex h-[70vh] items-center justify-center text-white">

            Loading...

        </div>

    );

}

return (
    <>
        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-4xl font-bold text-white">
                        {startup?.name}
                    </h1>

                    <p className="mt-2 text-slate-400">
                        {startup?.tagline}
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white transition hover:scale-105"
                >
                    <Plus size={18} />
                    Post Job
                </button>

            </div>

            {jobs.length === 0 ? (

                <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#111827] text-slate-400">

                    No jobs posted yet.

                </div>

            ) : (

<div className="grid gap-6">

    {jobs.map((job) => (

        <JobCard
            key={job._id}
            job={job}
            onRefresh={fetchData}
        />

    ))}

</div>

            )}

        </div>

        <PostJobModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            startupId={startupId}
            onSuccess={fetchData}
        />
    </>
);
}

export default ManageJobs;