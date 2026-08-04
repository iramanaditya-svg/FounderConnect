import { useEffect, useState } from "react";
import axios from "axios";

import StartupFeedCard from "./StartupFeedCard";

function StartupFeed() {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStartups = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/startups",
                {
                    withCredentials: true,
                }
            );

            setStartups(response.data.data.startups);
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
            <div className="flex h-56 items-center justify-center rounded-3xl border border-white/10 bg-[#111827] text-slate-400">
                Loading Startups...
            </div>
        );
    }

    if (startups.length === 0) {
        return (
            <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#111827] text-slate-500">
                No startups available.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {startups.map((startup) => (
                <StartupFeedCard
                    key={startup._id}
                    startup={startup}
                />
            ))}

        </div>
    );
}

export default StartupFeed;