import WelcomeBanner from "../dashboard/WelcomeBanner";
import StartupFeed from "../../components/startup/StartupFeed";
function Home() {
    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.activeRole;

    return (
        <div className="space-y-10">

            <WelcomeBanner />

            {role === "professional" && (
                <>
<section className="space-y-6">

    <StartupFeed />

</section>



                </>
            )}

            {role === "startup_builder" && (
                <>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                            <p className="text-sm text-gray-400">
                                Jobs Posted
                            </p>

                            <h2 className="mt-3 text-5xl font-bold text-white">
                                08
                            </h2>

                            <p className="mt-2 text-sm text-green-400">
                                +2 this week
                            </p>

                        </div>

                        <div className="col-span-2 rounded-3xl border border-white/10 bg-[#111827] p-6">

                            <h2 className="text-xl font-semibold text-white">
                                Hiring Status
                            </h2>

                            <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 text-gray-500">
                                Pie Chart
                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                        <div className="col-span-2 rounded-3xl border border-white/10 bg-[#111827] p-6">

                            <h2 className="text-xl font-semibold text-white">
                                Applications by Job
                            </h2>

                            <div className="mt-6 flex h-72 items-center justify-center rounded-2xl border border-dashed border-white/10 text-gray-500">
                                Bar Chart
                            </div>

                        </div>

                        <div className="rounded-3xl border border-white/10 bg-[#111827] p-6">

                            <h2 className="text-xl font-semibold text-white">
                                Quick Actions
                            </h2>

                            <div className="mt-6 space-y-4">

                                <button className="w-full rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 font-semibold text-white transition hover:scale-[1.02] hover:cursor-pointer">
                                    Post New Job
                                </button>

                                <button className="w-full rounded-xl border border-white/10 py-3 text-white transition hover:bg-white/5 hover:cursor-pointer">
                                    Manage Startup
                                </button>

                                <button className="w-full rounded-xl border border-white/10 py-3 text-white transition hover:bg-white/5 hover:cursor-pointer">
                                    View Applications
                                </button>

                            </div>

                        </div>

                    </div>


                </>
            )}

            {role === "investor" && (
                <>
                </>
            )}

        </div>
    );
}

export default Home;