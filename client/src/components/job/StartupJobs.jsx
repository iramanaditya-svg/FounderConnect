import { useEffect, useState } from "react";
import axios from "axios";

// import StartupJobCard from "./StartupJobCard";

function StartupJobs({ startupId }) {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {

        try {

            const response = await axios.get(
                `http://localhost:8000/api/v1/startups/${startupId}/jobs`,
                {
                    withCredentials: true,
                }
            );

            setJobs(response.data.data.jobs);

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        fetchJobs();
    }, [startupId]);

    if (loading) {
        return (
            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6 text-center text-slate-400">
                Loading open positions...
            </div>
        );
    }

    if (jobs.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#111827] p-6 text-center text-slate-500">
                No openings available.
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {jobs.map((job) => (

                <StartupJobCard
                    key={job._id}
                    job={job}
                />

            ))}

        </div>
    );
}

export default StartupJobs;