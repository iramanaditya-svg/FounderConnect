import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Plus } from "lucide-react";
function ManageJobs() {
const { startupId } = useParams();

const [startup, setStartup] = useState(null);
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);

const fetchData = async () => {

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
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white"
            >

                <Plus size={18} />

                Post Job

            </button>

        </div>

        {
            jobs.length === 0 ? (

                <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#111827] text-slate-400">

                    No jobs posted yet.

                </div>

            ) : (

                <div className="grid gap-6">

                    {
                        jobs.map((job) => (

                            <div
                                key={job._id}
                                className="rounded-3xl border border-slate-800 bg-[#111827] p-6"
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <h2 className="text-2xl font-bold text-white">

                                            {job.title}

                                        </h2>

                                        <p className="mt-2 text-slate-400">

                                            {job.employmentType} • {job.workMode}

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <h3 className="text-xl font-bold text-green-400">

                                            ₹ {job.minSalary} - ₹ {job.maxSalary}

                                        </h3>

                                    </div>

                                </div>

                            </div>

                        ))
                    }

                </div>

            )
        }

    </div>

);
}

export default ManageJobs;