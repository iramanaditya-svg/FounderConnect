import { useEffect, useState } from "react";
import axios from "axios";

import AppliedJobCard from "../../components/application/AppliedJobCard";

function AppliedJobs() {

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8000/api/v1/applications/my",
                {
                    withCredentials: true,
                }
            );

            setApplications(
                response.data.data.applications
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchApplications();

    }, []);

    if (loading) {

        return (
            <div className="rounded-3xl border border-white/10 bg-[#111827] p-8 text-center text-slate-400">
                Loading applications...
            </div>
        );

    }

    if (applications.length === 0) {

        return (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#111827] p-8 text-center text-slate-500">
                You haven't applied for any jobs yet.
            </div>
        );

    }

    return (

        <div className="space-y-5">

            {applications.map((application) => (

                <AppliedJobCard
                    key={application._id}
                    application={application}
                />

            ))}

        </div>

    );

}

export default AppliedJobs;