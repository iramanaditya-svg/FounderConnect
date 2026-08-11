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
    Search as SearchIcon,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";

function Sidebar() {
    const [settingsOpen, setSettingsOpen] = useState(false);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

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
                title: "Connections",
                icon: Users,
                path: "/professional/dashboard/connections",
            },
            {
    title: "Search",
    icon: SearchIcon,
    path: "/professional/dashboard/search",
},
        ];
    } else if (
        user?.activeRole === "startup_builder"
    ) {
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
                title: "Raise Investment",
                icon: DollarSign,
                path: "/startup_builder/dashboard/raise-investment",
            },
            {
                title: "Investment Requests",
                icon: TrendingUp,
                path: "/startup_builder/dashboard/investment-requests",
            },
            {
                title: "Connections",
                icon: Users,
                path: "/startup_builder/dashboard/connections",
            },
            {
    title: "Search",
    icon: SearchIcon,
    path: "/professional/dashboard/search",
},
        ];
    } else if (
        user?.activeRole === "investor"
    ) {
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
                title: "Connections",
                icon: Users,
                path: "/investor/dashboard/connections",
            },
            {
    title: "Search",
    icon: SearchIcon,
    path: "/professional/dashboard/search",
},
        ];
    }

    return (
        <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-white/10 bg-[#0B1023]">

            <div className="shrink-0 border-b border-white/10 px-6 py-7">

                <img
                    src={logo}
                    alt="FounderConnect"
                    className="h-11 w-auto"
                />

                <p className="mt-2 text-sm text-slate-400">
                    Connect • Build • Grow
                </p>

            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">

                <div className="space-y-2">

                    {menu.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.title}
                                to={item.path}
                                end={
                                    item.path ===
                                    menu[0]?.path
                                }
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`group relative flex min-h-[52px] items-center justify-between overflow-hidden rounded-2xl px-5 py-3 transition-all duration-300 ${
                                            isActive
                                                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg shadow-violet-500/20"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >

                                        {isActive && (
                                            <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-white" />
                                        )}

                                        <div className="flex min-w-0 items-center gap-4">

                                            <Icon
                                                size={21}
                                                className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                                            />

                                            <span className="truncate font-medium">
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

                </div>

                <div className="mt-3">

                    <button
                        onClick={() =>
                            setSettingsOpen(
                                !settingsOpen
                            )
                        }
                        className="flex min-h-[52px] w-full items-center justify-between rounded-2xl px-5 py-3 text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >

                        <div className="flex items-center gap-4">

                            <Settings
                                size={21}
                                className="shrink-0"
                            />

                            <span className="font-medium">
                                Settings
                            </span>

                        </div>

                        <ChevronDown
                            size={18}
                            className={`shrink-0 transition duration-300 ${
                                settingsOpen
                                    ? "rotate-180"
                                    : ""
                            }`}
                        />

                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            settingsOpen
                                ? "mt-2 max-h-40 opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >

                        <div className="ml-3 space-y-1 border-l border-white/10 pl-3">

                            <NavLink
                                to={`/${user?.activeRole}/dashboard/profile-management`}
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                                            isActive
                                                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >

                                        <UserCog
                                            size={18}
                                            className="shrink-0"
                                        />

                                        <span className="whitespace-nowrap">
                                            Profile Management
                                        </span>

                                    </div>
                                )}
                            </NavLink>

                            <NavLink
                                to={`/${user?.activeRole}/dashboard/edit-profile`}
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                                            isActive
                                                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >

                                        <UserCog
                                            size={18}
                                            className="shrink-0"
                                        />

                                        <span className="whitespace-nowrap">
                                            Edit Profile
                                        </span>

                                    </div>
                                )}
                            </NavLink>

                            <NavLink
                                to={`/${user?.activeRole}/dashboard/change-password`}
                            >
                                {({ isActive }) => (
                                    <div
                                        className={`flex min-h-[44px] items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition ${
                                            isActive
                                                ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white"
                                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >

                                        <KeyRound
                                            size={18}
                                            className="shrink-0"
                                        />

                                        <span className="whitespace-nowrap">
                                            Change Password
                                        </span>

                                    </div>
                                )}
                            </NavLink>

                        </div>

                    </div>

                </div>

            </nav>

            <div className="shrink-0 border-t border-white/10 bg-[#0B1023] p-4">

                <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-lg font-bold text-white">

                        {user?.profilePicture ? (
                            <img
                                src={
                                    user.profilePicture
                                }
                                alt={
                                    user.fullName
                                }
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user?.fullName
                                ?.charAt(0)
                                .toUpperCase()
                        )}

                    </div>

                    <div className="min-w-0 flex-1">

                        <h3 className="truncate text-sm font-semibold text-white">
                            {user?.fullName}
                        </h3>

                        <p className="truncate text-xs capitalize text-slate-400">
                            {user?.activeRole?.replace(
                                "_",
                                " "
                            )}
                        </p>

                    </div>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            window.location.href =
                                "/login";
                        }}
                        className="shrink-0 rounded-xl p-2 text-slate-400 transition hover:bg-red-500/20 hover:text-red-400"
                    >

                        <LogOut size={18} />

                    </button>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;