import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api/api";

import ApplicantCard from "../../../components/application/ApplicantCard";

function JobApplicants() {

    const { jobId } = useParams();

    const [applications, setApplications] = useState([]);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchApplicants = async () => {

        setLoading(true);

        try {

            const response = await api.get(

                `/jobs/${jobId}/applicants`,

                {
                    withCredentials: true,
                }

            );

            const data =
                response.data.data;

            setApplications(
                data.applications || []
            );

            if (
                data.applications &&
                data.applications.length > 0
            ) {

                setJob(
                    data.applications[0].job
                );

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchApplicants();

    }, [jobId]);

    if (loading) {

        return (

            <div className="flex h-[70vh] items-center justify-center text-white">

                Loading applicants...

            </div>

        );

    }
        return (

        <div className="space-y-8">

            <div>

                <h1 className="text-4xl font-bold text-white">

                    {job?.title || "Job Applicants"}

                </h1>

                <p className="mt-2 text-slate-400">

                    Manage applicants for this job.

                </p>

            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111827] p-6">

                <h2 className="text-2xl font-bold text-white">

                    {applications.length}

                </h2>

                <p className="mt-2 text-slate-400">

                    Total Applicants

                </p>

            </div>

            {

                applications.length === 0 ? (

                    <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#111827] text-slate-400">

                        No applicants yet.

                    </div>

                ) : (

                    <div className="space-y-5">

                        {

                            applications.map((application) => (

                                <ApplicantCard

                                    key={application._id}

                                    application={application}

                                    refreshApplicants={
                                        fetchApplicants
                                    }

                                />

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}

export default JobApplicants;