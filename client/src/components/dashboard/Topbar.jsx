import { Search } from "lucide-react";

function Topbar() {
    return (
        <header className="border-b border-white/10 bg-[#050816] p-6">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-3xl font-bold text-white">
                        Dashboard
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Discover startups matching your skills.
                    </p>

                </div>

                <div className="relative">

                    <Search
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                    />

                    <input
                        placeholder="Search startups..."
                        className="w-96 rounded-xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white outline-none focus:border-blue-500"
                    />

                </div>

            </div>

        </header>
    );
}

export default Topbar;