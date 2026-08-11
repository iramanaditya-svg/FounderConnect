import { useEffect, useState } from "react";
import {
    Search as SearchIcon,
    UserRound,
    Loader2,
    X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { searchProfiles } from "../../services/api/profile.service";

function Search() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 2) {
                handleSearch(query.trim());
            } else {
                setResults([]);
                setSearched(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = async (value) => {
        try {
            setLoading(true);
            setSearched(true);

            const response =
                await searchProfiles(value);

            setResults(
                response?.data || []
            );
        } catch (error) {
            console.error(
                "Profile search error:",
                error
            );

            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
        setSearched(false);
    };

    const getRoleLabel = (role) => {
        if (role === "startup_builder") {
            return "Startup Builder";
        }

        if (role === "investor") {
            return "Investor";
        }

        if (role === "professional") {
            return "Professional";
        }

        return "";
    };

    return (
        <div className="mx-auto w-full max-w-6xl">

            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">
                    Search People
                </h1>

                <p className="mt-2 text-slate-400">
                    Discover founders, investors and professionals on FounderConnect.
                </p>
            </div>

            <div className="relative">

                <SearchIcon
                    size={22}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                    type="text"
                    value={query}
                    onChange={(e) =>
                        setQuery(e.target.value)
                    }
                    placeholder="Search by name or username..."
                    className="w-full rounded-2xl border border-white/10 bg-[#0F172A] px-14 py-5 text-lg text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                />

                {query && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-white/10 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                )}

            </div>

            <div className="mt-8">

                {loading && (
                    <div className="flex min-h-[300px] items-center justify-center">
                        <Loader2
                            size={32}
                            className="animate-spin text-violet-500"
                        />
                    </div>
                )}

                {!loading &&
                    searched &&
                    results.length === 0 && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-[#0F172A]">

                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10">
                                <UserRound
                                    size={35}
                                    className="text-violet-400"
                                />
                            </div>

                            <h2 className="mt-6 text-xl font-semibold text-white">
                                No profiles found
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Try searching with another name or username.
                            </p>

                        </div>
                    )}

                {!loading &&
                    !searched && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#0F172A]">

                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/20 to-blue-600/20">
                                <SearchIcon
                                    size={35}
                                    className="text-violet-400"
                                />
                            </div>

                            <h2 className="mt-6 text-xl font-semibold text-white">
                                Find someone on FounderConnect
                            </h2>

                            <p className="mt-2 text-center text-sm text-slate-500">
                                Search by their name or username to view their profile.
                            </p>

                        </div>
                    )}

                {!loading &&
                    results.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {results.map((profile) => (
                                <button
                                    key={profile._id}
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/profile/${profile.username}`
                                        )
                                    }
                                    className="group flex w-full items-center gap-5 rounded-2xl border border-white/10 bg-[#0F172A] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-violet-500/40 hover:bg-[#131C31] hover:shadow-xl hover:shadow-violet-500/10"
                                >

                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-gradient-to-br from-violet-600 to-blue-600">

                                        {profile.profilePicture ? (
                                            <img
                                                src={
                                                    profile.profilePicture
                                                }
                                                alt={
                                                    profile.fullName
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                                                {profile.fullName
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                    </div>

                                    <div className="min-w-0 flex-1">

                                        <h3 className="truncate text-lg font-semibold text-white group-hover:text-violet-300">
                                            {profile.fullName}
                                        </h3>

                                        <p className="mt-1 truncate text-sm text-slate-500">
                                            @{profile.username}
                                        </p>

                                        <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                                            {getRoleLabel(
                                                profile.primaryRole
                                            )}
                                        </div>

                                    </div>

                                    <div className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                                        →
                                    </div>

                                </button>
                            ))}

                        </div>
                    )}

            </div>

        </div>
    );
}

export default Search;