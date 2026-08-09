import {
    Home,
    Briefcase,
    Clock3,
    Bell,
    Users,
    Settings,
    Building2,
    TrendingUp,
    LogOut,
    ChevronDown,
    UserCog,
    KeyRound,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";

function Sidebar() {
const [settingsOpen, setSettingsOpen] = useState(false);
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
            title: "Active Investments",
            icon: Briefcase,
            path: "/investor/dashboard/active-investments",
        },
        {
            title: "Invested Companies",
            icon: Building2,
            path: "/investor/dashboard/invested-companies",
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
    ];
}

    return (
        <aside className="flex w-72 flex-col border-r border-white/10 bg-[#0B1023]">

            <div className="border-b border-white/10 px-6 py-8">
                <img
                    src={logo}
                    alt="FounderConnect"
                    className="h-11 w-auto"
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
    <div className="px-4">

    <button
        onClick={() => setSettingsOpen(!settingsOpen)}
        className="flex w-full items-center justify-between rounded-2xl px-5 py-4 text-slate-400 transition hover:bg-white/5 hover:text-white"
    >

        <div className="flex items-center gap-4">

            <Settings size={21} />

            <span className="font-medium">
                Settings
            </span>

        </div>

        <ChevronDown
            size={18}
            className={`transition duration-300 ${
                settingsOpen
                    ? "rotate-180"
                    : ""
            }`}
        />

    </button>

    <div
        className={`overflow-hidden transition-all duration-300 ${
            settingsOpen
                ? "mt-2 max-h-40"
                : "max-h-0"
        }`}
    >

        <NavLink
            to={`/${user.activeRole}/dashboard/edit-profile`}
        >

            {({ isActive }) => (

                <div
                    className={`ml-5 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                        isActive
                            ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >

                    <UserCog size={18} />

                    Edit Profile

                </div>

            )}

        </NavLink>

        <NavLink
            to={`/${user.activeRole}/dashboard/change-password`}
        >

            {({ isActive }) => (

                <div
                    className={`ml-5 mt-2 flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                        isActive
                            ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                >

                    <KeyRound size={18} />

                    Change Password

                </div>

            )}

        </NavLink>

    </div>

</div>
            </nav>
<div className="border-t border-white/10 p-4">

    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-lg font-bold text-white">

            {user?.fullName?.charAt(0).toUpperCase()}

        </div>

        <div className="flex-1 overflow-hidden">

            <h3 className="truncate text-sm font-semibold text-white">

                {user?.fullName}

            </h3>

            <p className="truncate text-xs capitalize text-slate-400">

                {user?.activeRole.replace("_", " ")}

            </p>

        </div>

        <button
    onClick={() => {

        localStorage.clear();

        window.location.href = "/login";

    }}
    className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
>

            <LogOut size={18} />

        </button>

    </div>

</div>
        </aside>
    );
}

export default Sidebar;