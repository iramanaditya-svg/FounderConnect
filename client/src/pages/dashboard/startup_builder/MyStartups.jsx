import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Rocket } from "lucide-react";

import AddStartupModal from "../../../components/startup/AddStartupModal";
import StartupCard from "../../../components/startup/StartupCard";

function MyStartups() {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

            console.log(response.data);

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

    return (
        <div className="space-y-8">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        My Startups
                    </h1>

                    <p className="mt-2 text-slate-400">
                        Create, manage and grow your startups from one place.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 font-semibold text-white transition hover:scale-105"
                >
                    <Plus size={20} />
                    Add Startup
                </button>

            </div>

            {loading ? (

                <div className="flex min-h-[500px] items-center justify-center text-slate-400">
                    Loading...
                </div>

            ) : startups.length === 0 ? (

                <div className="flex min-h-[500px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-[#0F172A]">

                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-violet-600/20">
                        <Rocket
                            size={45}
                            className="text-violet-500"
                        />
                    </div>

                    <h2 className="mt-8 text-3xl font-bold text-white">
                        No Startups Yet
                    </h2>

                    <p className="mt-4 max-w-xl text-center text-slate-400">
                        Create your first startup profile to hire professionals,
                        connect with investors and start building your dream
                        company.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-8 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white transition hover:bg-violet-700"
                    >
                        Create Startup
                    </button>

                </div>

            ) : (

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

                    {startups.map((startup) => (
    <StartupCard
        key={startup._id}
        startup={startup}
        onRefresh={fetchStartups}
    />
))}
                </div>

            )}

            <AddStartupModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchStartups();
                    setIsModalOpen(false);
                }}
            />

        </div>
    );
}

export default MyStartups;