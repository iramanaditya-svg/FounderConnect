import { useEffect, useState } from "react";
import api from "../../services/api/api";

import StartupJobCard from "../startup/StartupJobCard";

function StartupJobs({ startupId }) {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const fetchAppliedJobs = async () => {

    try {

        const response = await api.get(
            "/applications/my",
            {
                withCredentials: true,
            }
        );

        setAppliedJobs(

            response.data.data.applications.map(

                (application) => application.job._id

            )

        );

    } catch (error) {

        console.log(error);

    }

};
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {

        try {

            const response = await api.get(
                `/startups/${startupId}/jobs`,
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

    fetchAppliedJobs();

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
    alreadyApplied={appliedJobs.includes(job._id)}
    onApplied={fetchAppliedJobs}
/>

            ))}

        </div>
    );
}

export default StartupJobs;