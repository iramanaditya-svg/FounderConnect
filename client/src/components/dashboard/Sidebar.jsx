import {
    Home,
    Briefcase,
    Clock3,
    Bell,
    Users,
    Settings,
    Building2,
    TrendingUp,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

function Sidebar() {

    const user = JSON.parse(localStorage.getItem("user"));

    let menu = [];

    if (user?.activeRole === "professional") {
        menu = [
            {
                title: "Home",
                icon: Home,
                path: "/professional/dashboard",
            },
            {
                title: "Applied Jobs",
                icon: Briefcase,
                path: "/professional/dashboard/applied-jobs",
            },
            {
                title: "Active Applications",
                icon: Clock3,
                path: "/professional/dashboard/active-applications",
            },
            {
                title: "Notifications",
                icon: Bell,
                path: "/professional/dashboard/notifications",
            },
            {
                title: "Connections",
                icon: Users,
                path: "/professional/dashboard/connections",
            },
            {
                title: "Settings",
                icon: Settings,
                path: "/professional/dashboard/settings",
            },
        ];
    }

    else if (user?.activeRole === "startup_builder") {
        menu = [
            {
                title: "Home",
                icon: Home,
                path: "/startup_builder/dashboard",
            },
            {
                title: "My Jobs",
                icon: Briefcase,
                path: "/startup_builder/dashboard/my-jobs",
            },
            {
                title: "Applicants",
                icon: Users,
                path: "/startup_builder/dashboard/applicants",
            },
            {
                title: "My Startups",
                icon: Building2,
                path: "/startup_builder/dashboard/my-startups",
            },
            {
                title: "Notifications",
                icon: Bell,
                path: "/startup_builder/dashboard/notifications",
            },
            {
                title: "Settings",
                icon: Settings,
                path: "/startup_builder/dashboard/settings",
            },
        ];
    }

    else if (user?.activeRole === "investor") {
        menu = [
            {
                title: "Home",
                icon: Home,
                path: "/investor/dashboard",
            },
            {
                title: "Portfolio",
                icon: TrendingUp,
                path: "/investor/dashboard/portfolio",
            },
            {
                title: "Startups",
                icon: Building2,
                path: "/investor/dashboard/startups",
            },
            {
                title: "Notifications",
                icon: Bell,
                path: "/investor/dashboard/notifications",
            },
            {
                title: "Connections",
                icon: Users,
                path: "/investor/dashboard/connections",
            },
            {
                title: "Settings",
                icon: Settings,
                path: "/investor/dashboard/settings",
            },
        ];
    }

    return (
        <aside className="flex w-72 flex-col border-r border-white/10 bg-[#0B1023]">

            <div className="border-b border-white/10 px-6 py-8">
                <img
                    src={logo}
                    alt="FounderConnect"
                    className="h-14 w-auto"
                />

                <p className="mt-2 text-sm text-slate-400">
                    Connect • Build • Grow
                </p>
            </div>

            <nav className="mt-6 flex-1 space-y-2 px-4">

                {menu.map((item) => {

                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.title}
                            to={item.path}
                            end={item.path === menu[0]?.path}
                        >
                            {({ isActive }) => (
                                <div
                                    className={`group relative flex items-center justify-between overflow-hidden rounded-2xl px-5 py-4 transition-all duration-300 ${
                                        isActive
                                            ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg shadow-violet-500/20"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-white" />
                                    )}

                                    <div className="flex items-center gap-4">
                                        <Icon
                                            size={21}
                                            className="transition-transform duration-300 group-hover:scale-110"
                                        />

                                        <span className="font-medium">
                                            {item.title}
                                        </span>
                                    </div>

                                    {item.badge && (
                                        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-semibold text-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            )}
                        </NavLink>
                    );
                })}

            </nav>

        </aside>
    );
}

export default Sidebar;