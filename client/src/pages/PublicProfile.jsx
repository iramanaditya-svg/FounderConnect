import { useEffect, useState } from "react";
import {
    ArrowLeft,
    BriefcaseBusiness,
    Building2,
    ExternalLink,
    GraduationCap,
    Globe,
    Loader2,
    Mail,
    MapPin,
    TrendingUp,
    UserRound,
    Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getPublicProfile } from "../services/api/profile.service";

function PublicProfile() {
    const { username } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getPublicProfile(username);

                const raw = response?.data;
                const data =
                    raw?.data?.profile ||
                    raw?.data ||
                    raw?.profile ||
                    raw ||
                    null;

                if (mounted) {
                    setProfile(data);
                }
            } catch (err) {
                console.error("Public profile error:", err);

                if (mounted) {
                    setError(
                        err.response?.data?.message ||
                            "Unable to load this profile."
                    );
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        if (username) {
            fetchProfile();
        }

        return () => {
            mounted = false;
        };
    }, [username]);

    const roleLabel = (role) => {
        if (role === "startup_builder") return "Startup Builder";
        if (role === "investor") return "Investor";
        if (role === "professional") return "Professional";

        return String(role || "")
            .replaceAll("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const roleClasses = (role) => {
        if (role === "startup_builder") {
            return "border-violet-500/30 bg-violet-500/10 text-violet-300";
        }

        if (role === "investor") {
            return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
        }

        return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    };

    const roleIcon = (role) => {
        if (role === "startup_builder") {
            return <Building2 size={15} />;
        }

        if (role === "investor") {
            return <TrendingUp size={15} />;
        }

        return <BriefcaseBusiness size={15} />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030712] text-white">
                <div className="flex min-h-screen items-center justify-center">
                    <Loader2
                        size={34}
                        className="animate-spin text-violet-400"
                    />
                </div>
            </div>
        );
    }

    if (error || !profile?.user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
                <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0F172A] p-10 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                        <UserRound
                            size={36}
                            className="text-red-400"
                        />
                    </div>

                    <h1 className="mt-6 text-2xl font-bold">
                        Profile Not Found
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                        {error || "This profile does not exist."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mt-7 rounded-xl bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const user = profile.user || {};

    const fullName =
        user.fullName ||
        user.name ||
        "FounderConnect Member";

    const profilePicture =
        user.profilePicture ||
        user.avatar ||
        user.avatarUrl ||
        "";

    const roles = Array.isArray(user.roles)
        ? user.roles
        : user.role
        ? [user.role]
        : user.activeRole
        ? [user.activeRole]
        : [];

    const startupBuilder =
        profile.startupBuilderProfile ||
        profile.startup_builder_profile ||
        null;

    const investor =
        profile.investorProfile ||
        profile.investor_profile ||
        null;

    const professional =
        profile.professionalProfile ||
        profile.professional_profile ||
        null;

    const primaryProfile =
        startupBuilder || investor || professional || {};

    const headline =
        primaryProfile.headline ||
        primaryProfile.title ||
        primaryProfile.designation ||
        "";

    const bio =
        primaryProfile.bio ||
        user.bio ||
        "Building, connecting and growing with FounderConnect.";

    const location =
        primaryProfile.location ||
        user.location ||
        "";

    const experience =
        primaryProfile.experience ||
        "";

    const startups = profile.startups || [];

    const linkedin =
        professional?.linkedin ||
        investor?.linkedin ||
        startupBuilder?.linkedin ||
        "";

    const github = professional?.github || "";

    const website =
        startupBuilder?.website ||
        investor?.website ||
        "";

    const portfolio =
        professional?.portfolio ||
        investor?.portfolio ||
        "";

    return (
        <div className="min-h-screen bg-[#030712] text-white">
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute -left-48 -top-48 h-[550px] w-[550px] rounded-full bg-violet-600/10 blur-[150px]" />
                <div className="absolute -right-48 top-[20%] h-[550px] w-[550px] rounded-full bg-blue-600/10 blur-[150px]" />
                <div className="absolute bottom-[-250px] left-[35%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]" />
            </div>

            <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mb-5 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                >
                    <ArrowLeft size={17} />
                    Back
                </button>

                <section className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0B1220] shadow-2xl shadow-black/30">
                    <div className="relative h-36 overflow-hidden sm:h-40 md:h-44">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-indigo-950 to-[#0B1220]" />

                        <div className="absolute -left-24 -top-52 h-[500px] w-[500px] rounded-full bg-violet-600/25 blur-[100px]" />

                        <div className="absolute -right-24 -top-48 h-[450px] w-[450px] rounded-full bg-blue-600/20 blur-[100px]" />

                        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />

                        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#111827]/70 px-4 py-2 text-xs font-medium text-slate-300 backdrop-blur-xl">
                            <span className="text-violet-400">✦</span>
                            FounderConnect Profile
                        </div>
                    </div>

                    <div className="relative px-5 pb-6 sm:px-7 md:px-9">
                        <div className="-mt-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                            <div className="flex min-w-0 items-end gap-4 sm:gap-5">
                                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-[5px] border-[#0B1220] bg-gradient-to-br from-violet-600 to-blue-600 shadow-2xl sm:h-32 sm:w-32">
                                    {profilePicture ? (
                                        <img
                                            src={profilePicture}
                                            alt={fullName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-5xl font-bold text-white">
                                            {fullName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <span className="absolute bottom-2 left-2 h-5 w-5 rounded-full border-4 border-[#0B1220] bg-emerald-400" />
                                </div>

                                <div className="min-w-0 pb-1">
                                    <h1 className="truncate text-3xl font-bold tracking-tight text-white sm:text-4xl">
                                        {fullName}
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-500">
                                        @{user.username || username}
                                    </p>

                                    {headline && (
                                        <p className="mt-2 text-sm font-medium text-slate-300 sm:text-base">
                                            {headline}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex shrink-0">
                                <button
    type="button"
    onClick={() => {
        const currentUser = JSON.parse(
            localStorage.getItem("user")
        );

        navigate(
            `/${currentUser.activeRole}/dashboard/connections`,
            {
                state: {
                    openChatWith: user._id,
                },
            }
        );
    }}
    className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/30"
>
    Message
</button>
                            </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            {roles.length > 0 ? (
                                roles.map((role) => (
                                    <span
                                        key={role}
                                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${roleClasses(
                                            role
                                        )}`}
                                    >
                                        {roleIcon(role)}
                                        {roleLabel(role)}
                                    </span>
                                ))
                            ) : (
                                <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 text-xs font-semibold text-violet-300">
                                    <UserRound size={15} />
                                    FounderConnect Member
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-xl shadow-black/20 md:p-7">
                            <SectionHeading
                                icon={
                                    <UserRound
                                        size={22}
                                        className="text-violet-400"
                                    />
                                }
                                title="About"
                                subtitle={`A little about ${fullName}`}
                            />

                            <p className="mt-6 whitespace-pre-line text-[15px] leading-7 text-slate-300">
                                {bio}
                            </p>
                        </section>

                        {startupBuilder && (
                            <RoleCard
                                title="Startup Builder"
                                subtitle="Founder & Builder"
                                icon={
                                    <Building2
                                        size={23}
                                        className="text-violet-400"
                                    />
                                }
                                iconBg="bg-violet-500/10"
                            >
                                {startupBuilder.headline && (
                                    <h3 className="text-lg font-semibold text-white">
                                        {startupBuilder.headline}
                                    </h3>
                                )}

                                {startupBuilder.bio && (
                                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-400">
                                        {startupBuilder.bio}
                                    </p>
                                )}

                                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                    {startupBuilder.location && (
                                        <InfoBox
                                            icon={<MapPin size={17} />}
                                            label="Location"
                                            value={
                                                startupBuilder.location
                                            }
                                        />
                                    )}

                                    {startupBuilder.experience && (
                                        <InfoBox
                                            icon={
                                                <BriefcaseBusiness
                                                    size={17}
                                                />
                                            }
                                            label="Experience"
                                            value={
                                                startupBuilder.experience
                                            }
                                        />
                                    )}
                                </div>
                            </RoleCard>
                        )}

                        {investor && (
                            <RoleCard
                                title="Investor"
                                subtitle="Investment Profile"
                                icon={
                                    <TrendingUp
                                        size={23}
                                        className="text-emerald-400"
                                    />
                                }
                                iconBg="bg-emerald-500/10"
                            >
                                {investor.bio && (
                                    <p className="whitespace-pre-line text-sm leading-7 text-slate-400">
                                        {investor.bio}
                                    </p>
                                )}

                                <TagSection
                                    title="Preferred Industries"
                                    items={investor.preferredIndustries}
                                    color="emerald"
                                />

                                <TagSection
                                    title="Preferred Stages"
                                    items={investor.preferredStages}
                                    color="blue"
                                />
                            </RoleCard>
                        )}

                        {professional && (
                            <RoleCard
                                title="Professional"
                                subtitle="Professional Profile"
                                icon={
                                    <BriefcaseBusiness
                                        size={23}
                                        className="text-blue-400"
                                    />
                                }
                                iconBg="bg-blue-500/10"
                            >
                                {professional.headline && (
                                    <h3 className="text-lg font-semibold text-white">
                                        {professional.headline}
                                    </h3>
                                )}

                                {professional.experience && (
                                    <div className="mt-5">
                                        <InfoBox
                                            icon={
                                                <BriefcaseBusiness
                                                    size={17}
                                                />
                                            }
                                            label="Experience"
                                            value={
                                                professional.experience
                                            }
                                        />
                                    </div>
                                )}

                                <TagSection
                                    title="Skills"
                                    items={professional.skills}
                                    color="blue"
                                />

                                {professional.education &&
                                    Object.values(
                                        professional.education
                                    ).some(Boolean) && (
                                        <div className="mt-6">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap
                                                    size={19}
                                                    className="text-blue-400"
                                                />
                                                <h3 className="text-sm font-semibold text-white">
                                                    Education
                                                </h3>
                                            </div>

                                            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                                {professional.education
                                                    .college && (
                                                    <p className="font-semibold text-white">
                                                        {
                                                            professional
                                                                .education
                                                                .college
                                                        }
                                                    </p>
                                                )}

                                                <p className="mt-1 text-sm text-slate-400">
                                                    {[
                                                        professional.education
                                                            .degree,
                                                        professional.education
                                                            .branch,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" • ")}
                                                </p>

                                                {professional.education
                                                    .graduationYear && (
                                                    <p className="mt-2 text-xs text-slate-500">
                                                        Graduation{" "}
                                                        {
                                                            professional
                                                                .education
                                                                .graduationYear
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </RoleCard>
                        )}

                        {startups.length > 0 && (
                            <section className="rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-xl shadow-black/20 md:p-7">
                                <div className="flex items-center justify-between">
                                    <SectionHeading
                                        icon={
                                            <Building2
                                                size={22}
                                                className="text-violet-400"
                                            />
                                        }
                                        title="Startups"
                                        subtitle={`Founded by ${fullName}`}
                                    />

                                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                                        {startups.length}
                                    </span>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {startups.map((startup) => (
                                        <StartupCard
                                            key={
                                                startup._id ||
                                                startup.id ||
                                                startup.name
                                            }
                                            startup={startup}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-xl shadow-black/20">
                            <h2 className="text-lg font-bold text-white">
                                Profile Details
                            </h2>

                            <div className="mt-5 space-y-3">
                                {location && (
                                    <InfoBox
                                        icon={
                                            <MapPin
                                                size={18}
                                            />
                                        }
                                        label="Location"
                                        value={location}
                                    />
                                )}

                                {experience && (
                                    <InfoBox
                                        icon={
                                            <BriefcaseBusiness
                                                size={18}
                                            />
                                        }
                                        label="Experience"
                                        value={experience}
                                    />
                                )}

                                <InfoBox
                                    icon={
                                        <Users size={18} />
                                    }
                                    label="Roles"
                                    value={
                                        roles.length
                                            ? roles
                                                  .map(roleLabel)
                                                  .join(", ")
                                            : "FounderConnect Member"
                                    }
                                />

                                {user.email && (
                                    <InfoBox
                                        icon={
                                            <Mail size={18} />
                                        }
                                        label="Email"
                                        value={user.email}
                                    />
                                )}
                            </div>
                        </section>

                        <LinksSection
                            linkedin={linkedin}
                            github={github}
                            website={website}
                            portfolio={portfolio}
                        />
                    </aside>
                </div>
            </main>
        </div>
    );
}

function SectionHeading({
    icon,
    title,
    subtitle,
}) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10">
                {icon}
            </div>

            <div>
                <h2 className="text-xl font-bold text-white">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-sm text-slate-500">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

function RoleCard({
    title,
    subtitle,
    icon,
    iconBg,
    children,
}) {
    return (
        <section className="rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-xl shadow-black/20 md:p-7">
            <div className="flex items-center gap-4">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
                >
                    {icon}
                </div>

                <div>
                    <h2 className="text-xl font-bold text-white">
                        {title}
                    </h2>

                    <p className="text-sm text-slate-500">
                        {subtitle}
                    </p>
                </div>
            </div>

            <div className="mt-6">
                {children}
            </div>
        </section>
    );
}

function InfoBox({
    icon,
    label,
    value,
}) {
    if (!value) return null;

    return (
        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-white/15 hover:bg-white/[0.035]">
            <div className="mt-0.5 shrink-0 text-violet-400">
                {icon}
            </div>

            <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500">
                    {label}
                </p>

                <p className="mt-1 break-words text-sm text-slate-300">
                    {value}
                </p>
            </div>
        </div>
    );
}

function TagSection({
    title,
    items,
    color = "blue",
}) {
    if (!items?.length) return null;

    const classes =
        color === "emerald"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            : "border-blue-500/20 bg-blue-500/10 text-blue-300";

    return (
        <div className="mt-6">
            <h3 className="text-sm font-semibold text-white">
                {title}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
                {items.map((item) => (
                    <span
                        key={item}
                        className={`rounded-full border px-3 py-1.5 text-xs capitalize ${classes}`}
                    >
                        {String(item).replaceAll(
                            "_",
                            " "
                        )}
                    </span>
                ))}
            </div>
        </div>
    );
}

function LinksSection({
    linkedin,
    github,
    website,
    portfolio,
}) {
    const links = [
        {
            label: "LinkedIn",
            value: linkedin,
            icon: <ExternalLink size={18} />,
        },
        {
            label: "GitHub",
            value: github,
            icon: <ExternalLink size={18} />,
        },
        {
            label: "Website",
            value: website,
            icon: <Globe size={18} />,
        },
        {
            label: "Portfolio",
            value: portfolio,
            icon: <ExternalLink size={18} />,
        },
    ].filter((item) => item.value);

    if (!links.length) return null;

    const normalizeUrl = (value) =>
        value.startsWith("http://") ||
        value.startsWith("https://")
            ? value
            : `https://${value}`;

    return (
        <section className="rounded-3xl border border-white/10 bg-[#0F172A] p-6 shadow-xl shadow-black/20">
            <h2 className="text-lg font-bold text-white">
                Links
            </h2>

            <div className="mt-5 space-y-3">
                {links.map((link) => (
                    <a
                        key={link.label}
                        href={normalizeUrl(link.value)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-slate-400 transition hover:border-violet-500/30 hover:bg-violet-500/5 hover:text-violet-300"
                    >
                        {link.icon}

                        <span className="text-sm font-medium">
                            {link.label}
                        </span>

                        <ExternalLink
                            size={14}
                            className="ml-auto"
                        />
                    </a>
                ))}
            </div>
        </section>
    );
}

function StartupCard({ startup }) {
    return (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0B1220] transition duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-500/10">
            <div className="flex h-24 items-center justify-center bg-gradient-to-br from-violet-950 via-indigo-950 to-blue-950">
                {startup.logo ? (
                    <img
                        src={startup.logo}
                        alt={startup.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                    />
                ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10">
                        <Building2
                            size={28}
                            className="text-violet-400"
                        />
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate text-lg font-bold text-white">
                            {startup.name ||
                                "Unnamed Startup"}
                        </h3>

                        <p className="mt-1 truncate text-sm text-slate-400">
                            {startup.tagline ||
                                "No tagline added"}
                        </p>
                    </div>

                    {startup.stage && (
                        <span className="shrink-0 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold capitalize text-violet-300">
                            {String(
                                startup.stage
                            ).replaceAll(
                                "_",
                                " "
                            )}
                        </span>
                    )}
                </div>

                {startup.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                        {startup.description}
                    </p>
                )}

                {startup.industry?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {startup.industry
                            .slice(0, 3)
                            .map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-400"
                                >
                                    {item}
                                </span>
                            ))}
                    </div>
                )}

                {startup.location && (
                    <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                        <MapPin size={16} />
                        {startup.location}
                    </div>
                )}

                {startup.website && (
                    <a
                        href={
                            startup.website.startsWith(
                                "http"
                            )
                                ? startup.website
                                : `https://${startup.website}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300"
                    >
                        <Globe size={16} />
                        Website
                    </a>
                )}

            
            </div>
        </div>
    );
}

export default PublicProfile;