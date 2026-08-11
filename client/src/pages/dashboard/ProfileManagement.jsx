import {
    useState,
} from "react";

import {
    UserRound,
    Plus,
    Trash2,
    ArrowRight,
    Camera,
    X,
} from "lucide-react";

import {
    useNavigate,
} from "react-router-dom";

import {
    switchRole,
    updateProfilePicture,
    deleteAccount,
} from "../../services/api/profileManagement.service";

import {
    deleteProfessionalProfile,
} from "../../services/api/professional.service";

import {
    deleteStartupBuilderProfile,
} from "../../services/api/startupBuilder.service";

import {
    deleteInvestorProfile,
} from "../../services/api/investor.service";

function ProfileManagement() {
    const navigate = useNavigate();

    const [user, setUser] = useState(
        JSON.parse(
            localStorage.getItem("user")
        )
    );

    const [showDeleteAccount, setShowDeleteAccount] =
        useState(false);

    const [showDeleteRole, setShowDeleteRole] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const roles = [
        {
            key: "startup_builder",
            title: "Startup Builder",
            description:
                "Build startups, hire professionals and raise investments.",
        },
        {
            key: "professional",
            title: "Professional",
            description:
                "Find opportunities and work with startups.",
        },
        {
            key: "investor",
            title: "Investor",
            description:
                "Discover and invest in promising startups.",
        },
    ];

    const existingRoles =
        user?.roles || [];

    const availableRoles =
        roles.filter(
            (role) =>
                !existingRoles.includes(
                    role.key
                )
        );

    const handleSwitchRole = async (
        role
    ) => {
        try {
            setLoading(true);

            const response =
                await switchRole(
                    role
                );

            const updatedUser =
                response.data;

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            setUser(updatedUser);

            navigate(
                `/${role}/dashboard`
            );
        } catch (error) {
            alert(
                error.response?.data
                    ?.message ||
                    "Unable to switch role."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddRole = async (
        role
    ) => {
        try {
            setLoading(true);

            const response =
                await switchRole(
                    role
                );

            const updatedUser =
                response.data;

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            setUser(updatedUser);

            navigate(
                `/${role}/complete-profile`
            );
        } catch (error) {
            alert(
                error.response?.data
                    ?.message ||
                    "Unable to add role."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole =
        async (role) => {
            try {
                setLoading(true);

                let response;

                if (
                    role ===
                    "professional"
                ) {
                    response =
                        await deleteProfessionalProfile();
                }

                if (
                    role ===
                    "startup_builder"
                ) {
                    response =
                        await deleteStartupBuilderProfile();
                }

                if (
                    role ===
                    "investor"
                ) {
                    response =
                        await deleteInvestorProfile();
                }

                const updatedUser = {
                    ...user,
                    roles:
                        response.data
                            .roles,
                    activeRole:
                        response.data
                            .activeRole,
                    isProfileCompleted:
                        response.data
                            .roles?.length >
                        0,
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );

                setUser(updatedUser);
                setShowDeleteRole(
                    null
                );

                if (
                    updatedUser.roles
                        .length === 0
                ) {
                    navigate(
                        "/select-role"
                    );
                    return;
                }

                navigate(
                    `/${updatedUser.activeRole}/dashboard`
                );
            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                        "Unable to delete profile."
                );
            } finally {
                setLoading(false);
            }
        };

    const handleDeleteAccount =
        async () => {
            try {
                setLoading(true);

                await deleteAccount();

                localStorage.clear();

                navigate(
                    "/",
                    {
                        replace: true,
                    }
                );
            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                        "Unable to delete account."
                );
            } finally {
                setLoading(false);
            }
        };

    const handleProfilePicture =
        (e) => {
            const file =
                e.target.files?.[0];

            if (!file) return;

            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {
                alert(
                    "Please select an image."
                );
                return;
            }

            const reader =
                new FileReader();

            reader.onload = () => {
                const image =
                    new Image();

                image.onload = () => {
                    const canvas =
                        document.createElement(
                            "canvas"
                        );

                    const size = 300;

                    canvas.width =
                        size;

                    canvas.height =
                        size;

                    const context =
                        canvas.getContext(
                            "2d"
                        );

                    const scale =
                        Math.max(
                            size /
                                image.width,
                            size /
                                image.height
                        );

                    const width =
                        image.width *
                        scale;

                    const height =
                        image.height *
                        scale;

                    const x =
                        (size -
                            width) /
                        2;

                    const y =
                        (size -
                            height) /
                        2;

                    context.drawImage(
                        image,
                        x,
                        y,
                        width,
                        height
                    );

                    const imageData =
                        canvas.toDataURL(
                            "image/jpeg",
                            0.8
                        );

                    saveProfilePicture(
                        imageData
                    );
                };

                image.src =
                    reader.result;
            };

            reader.readAsDataURL(
                file
            );
        };

    const saveProfilePicture =
        async (
            imageData
        ) => {
            try {
                setLoading(true);

                const response =
                    await updateProfilePicture(
                        imageData
                    );

                const updatedUser =
                    response.data;

                localStorage.setItem(
                    "user",
                    JSON.stringify(
                        updatedUser
                    )
                );

                setUser(updatedUser);
            } catch (error) {
                alert(
                    error.response?.data
                        ?.message ||
                        "Unable to update profile picture."
                );
            } finally {
                setLoading(false);
            }
        };

    const removeProfilePicture =
        async () => {
            await saveProfilePicture(
                ""
            );
        };

    return (
        <div className="mx-auto max-w-6xl space-y-8">

            <div>
                <h1 className="text-4xl font-bold text-white">
                    Profile Management
                </h1>

                <p className="mt-2 text-slate-400">
                    Manage your roles, profiles and account.
                </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">

                <div className="flex flex-col gap-6 md:flex-row md:items-center">

                    <div className="relative">

                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-4xl font-bold text-white">

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
                                    ?.charAt(
                                        0
                                    )
                                    .toUpperCase()
                            )}

                        </div>

                        <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">

                            <Camera
                                size={17}
                            />

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleProfilePicture
                                }
                                className="hidden"
                            />

                        </label>

                    </div>

                    <div className="flex-1">

                        <h2 className="text-2xl font-bold text-white">
                            {user?.fullName}
                        </h2>

                        <p className="mt-1 text-slate-500">
                            @{user?.username}
                        </p>

                        <p className="mt-3 text-sm capitalize text-violet-400">
                            {user?.activeRole?.replace(
                                "_",
                                " "
                            )}
                        </p>

                    </div>

                    {user?.profilePicture && (
                        <button
                            onClick={
                                removeProfilePicture
                            }
                            className="rounded-xl border border-red-500/20 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                        >
                            Remove Photo
                        </button>
                    )}

                </div>

            </div>

            <section className="space-y-5">

                <div>
                    <h2 className="text-2xl font-bold text-white">
                        Your Profiles
                    </h2>

                    <p className="mt-1 text-slate-500">
                        Switch between your existing roles or remove a profile.
                    </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                    {roles
                        .filter((role) =>
                            existingRoles.includes(
                                role.key
                            )
                        )
                        .map((role) => (
                            <div
                                key={
                                    role.key
                                }
                                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
                            >

                                <div className="flex items-start justify-between">

                                    <div className="flex gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                                            <UserRound
                                                size={
                                                    22
                                                }
                                            />
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-white">
                                                {
                                                    role.title
                                                }
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    role.description
                                                }
                                            </p>
                                        </div>

                                    </div>

                                    {user?.activeRole ===
                                        role.key && (
                                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                            Active
                                        </span>
                                    )}

                                </div>

                                <div className="mt-6 flex gap-3">

                                    {user?.activeRole !==
                                        role.key && (
                                        <button
                                            onClick={() =>
                                                handleSwitchRole(
                                                    role.key
                                                )
                                            }
                                            disabled={
                                                loading
                                            }
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 py-3 font-semibold text-white"
                                        >
                                            Switch
                                            <ArrowRight
                                                size={
                                                    17
                                                }
                                            />
                                        </button>
                                    )}

                                    <button
                                        onClick={() =>
                                            setShowDeleteRole(
                                                role.key
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                        className="rounded-xl border border-red-500/20 px-4 py-3 text-red-400 transition hover:bg-red-500/10"
                                    >
                                        <Trash2
                                            size={
                                                18
                                            }
                                        />
                                    </button>

                                </div>

                            </div>
                        ))}

                </div>

            </section>

            {availableRoles.length >
                0 && (
                <section className="space-y-5">

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            Add Profile
                        </h2>

                        <p className="mt-1 text-slate-500">
                            Add another role to your FounderConnect account.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">

                        {availableRoles.map(
                            (role) => (
                                <button
                                    key={
                                        role.key
                                    }
                                    onClick={() =>
                                        handleAddRole(
                                            role.key
                                        )
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="group rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-left transition hover:border-violet-500/40 hover:bg-white/[0.06]"
                                >

                                    <div className="flex items-center justify-between">

                                        <div>
                                            <h3 className="text-lg font-bold text-white">
                                                {
                                                    role.title
                                                }
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-500">
                                                {
                                                    role.description
                                                }
                                            </p>
                                        </div>

                                        <Plus
                                            size={
                                                24
                                            }
                                            className="text-violet-400 transition group-hover:scale-110"
                                        />

                                    </div>

                                </button>
                            )
                        )}

                    </div>

                </section>
            )}

            <section className="rounded-3xl border border-red-500/10 bg-red-500/[0.03] p-7">

                <h2 className="text-xl font-bold text-white">
                    Delete Account
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Permanently delete your FounderConnect account, profiles, startups, applications, investments and conversations.
                </p>

                <button
                    onClick={() =>
                        setShowDeleteAccount(
                            true
                        )
                    }
                    className="mt-5 rounded-xl border border-red-500/30 px-5 py-3 font-medium text-red-400 transition hover:bg-red-500/10"
                >
                    Delete Account
                </button>

            </section>

            {showDeleteRole && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111827] p-7">

                        <h2 className="text-xl font-bold text-white">
                            Delete Profile?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-400">
                            This will remove your{" "}
                            {
                                roles.find(
                                    (role) =>
                                        role.key ===
                                        showDeleteRole
                                )?.title
                            }{" "}
                            profile and role from your account.
                        </p>

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() =>
                                    setShowDeleteRole(
                                        null
                                    )
                                }
                                className="flex-1 rounded-xl border border-white/10 py-3 text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() =>
                                    handleDeleteRole(
                                        showDeleteRole
                                    )
                                }
                                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

            {showDeleteAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-[#111827] p-7">

                        <div className="flex items-start justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Delete Account Permanently?
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-400">
                                    This action cannot be undone. Your account and associated data will be permanently deleted.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowDeleteAccount(
                                        false
                                    )
                                }
                                className="rounded-xl p-2 text-slate-500 hover:bg-white/5 hover:text-white"
                            >
                                <X
                                    size={
                                        19
                                    }
                                />
                            </button>

                        </div>

                        <div className="mt-6 flex gap-3">

                            <button
                                onClick={() =>
                                    setShowDeleteAccount(
                                        false
                                    )
                                }
                                className="flex-1 rounded-xl border border-white/10 py-3 text-white"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={
                                    handleDeleteAccount
                                }
                                className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white"
                            >
                                Delete Forever
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}

export default ProfileManagement;