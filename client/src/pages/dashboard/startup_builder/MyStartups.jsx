import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Rocket, X } from "lucide-react";

import AddStartupModal from "../../../components/startup/AddStartupModal";
import StartupCard from "../../../components/startup/StartupCard";

function MyStartups() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);

    const [investorModal, setInvestorModal] = useState(false);
    const [investorMessage, setInvestorMessage] = useState("");

    const fetchStartups = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/v1/startups/my-startups",
                {
                    withCredentials: true,
                }
            );

            setStartups(
                response.data.data.startups || []
            );
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStartups();
    }, []);

    const handleOpenToInvestors = async (startup) => {
        try {
            if (startup.openToInvestors) {
                await axios.patch(
                    `http://localhost:8000/api/v1/startups/${startup._id}`,
                    {
                        openToInvestors: false,
                    },
                    {
                        withCredentials: true,
                    }
                );

                setStartups((prev) =>
                    prev.map((item) =>
                        item._id === startup._id
                            ? {
                                  ...item,
                                  openToInvestors: false,
                              }
                            : item
                    )
                );

                return;
            }

            const jobsResponse = await axios.get(
                `http://localhost:8000/api/v1/startups/${startup._id}/jobs`,
                {
                    withCredentials: true,
                }
            );

            const jobs =
                jobsResponse.data?.data?.jobs || [];

            let hasActiveApplications = false;

            for (const job of jobs) {
                const applicantsResponse =
                    await axios.get(
                        `http://localhost:8000/api/v1/jobs/${job._id}/applicants`,
                        {
                            withCredentials: true,
                        }
                    );

                const applications =
                    applicantsResponse.data?.data?.applications || [];

                const activeApplications =
                    applications.filter(
                        (application) =>
                            application.status === "pending" ||
                            application.status === "shortlisted"
                    );

                if (activeApplications.length > 0) {
                    hasActiveApplications = true;
                    break;
                }
            }

            if (hasActiveApplications) {
                setInvestorMessage(
                    "You have active job applications. Resolve them first before opening this startup to investors."
                );

                setInvestorModal(true);

                return;
            }

            await axios.patch(
                `http://localhost:8000/api/v1/startups/${startup._id}`,
                {
                    openToInvestors: true,
                },
                {
                    withCredentials: true,
                }
            );

            setStartups((prev) =>
                prev.map((item) =>
                    item._id === startup._id
                        ? {
                              ...item,
                              openToInvestors: true,
                          }
                        : item
                )
            );
        } catch (error) {
            console.log(error);

            setInvestorMessage(
                error.response?.data?.message ||
                    "Failed to update investor settings."
            );

            setInvestorModal(true);
        }
    };

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
                            onOpenToInvestors={handleOpenToInvestors}
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

            {investorModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-7 shadow-2xl">

                        <div className="flex items-start justify-between gap-5">

                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Cannot Open to Investors
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    {investorMessage}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setInvestorModal(false)
                                }
                                className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <button
                            onClick={() =>
                                setInvestorModal(false)
                            }
                            className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02]"
                        >
                            Okay
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default MyStartups;