import { useEffect, useState } from "react";
import axios from "axios";
import { BriefcaseBusiness } from "lucide-react";

import StartupJobManagerCard from "../../../components/job/StartupJobManagerCard";
function MyJobs() {

    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStartups = async () => {
    try {
        const response = await axios.get(
            "http://localhost:8000/api/v1/startups/my-startups",
            {
                withCredentials: true,
            }
        );

        setStartups(response.data.data.startups || []);
    } catch (error) {
        console.log(error);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {

        fetchStartups();

    }, []);

    if (loading) {

        return (

            <div className="flex h-72 items-center justify-center text-lg text-slate-400">

                Loading...

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED]">

                    <BriefcaseBusiness
                        size={28}
                        className="text-white"
                    />

                </div>

                <div>

                    <h1 className="text-4xl font-bold text-white">
                        My Jobs
                    </h1>

                    <p className="mt-1 text-slate-400">
                        Manage hiring for all your startups.
                    </p>

                </div>

            </div>

            {
                startups.length === 0 ? (

                    <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827] text-slate-500">

                        You haven't created any startup yet.

                    </div>

                ) : (

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        {
                            startups.map((startup) => (

                                <StartupJobManagerCard
                                    key={startup._id}
                                    startup={startup}
                                />

                            ))
                        }

                    </div>

                )
            }

        </div>

    );

}

export default MyJobs;