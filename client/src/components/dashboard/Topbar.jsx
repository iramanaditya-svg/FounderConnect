import { CalendarDays } from "lucide-react";

function Topbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    const role = user?.activeRole;

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const content = {
        startup_builder: {
            title: "Startup Builder Dashboard",
            subtitle:
                "Manage your startups, hiring and growth from one place.",
        },

        professional: {
            title: "Professional Dashboard",
            subtitle:
                "Discover startups and opportunities matching your skills.",
        },

        investor: {
            title: "Investor Dashboard",
            subtitle:
                "Discover promising startups and investment opportunities.",
        },
    };

    const current = content[role] || content.professional;

    return (
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050816]/90 px-8 py-6 backdrop-blur-xl">

            <div className="flex items-center justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {current.title}
                    </h1>

                    <p className="mt-2 text-slate-400">
                        {current.subtitle}
                    </p>
                </div>

                <div className="flex items-center gap-6">

                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">

                        <CalendarDays
                            size={18}
                            className="text-violet-400"
                        />

                        <span className="text-sm text-slate-300">
                            {today}
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;