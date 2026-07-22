import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";


function LoginCard() {
    return (
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl bg-white/[0.06] border-white/15 shadow-2xl shadow-violet-500/10">

            <div className="mb-8 flex justify-center">
                <img
                    src={logo}
                    alt="FounderConnect Logo"
                    className="h-auto w-auto object-contain"
                />
            </div>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Welcome Back
                </h1>

                <p className="mt-2 text-white/60">
                    Sign in to continue building amazing startups.
                </p>

            </div>

            <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-white/80">
                    Email Address
                </label>

                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white/10"
                />
            </div>
            <div className="mb-3">
                <label className="mb-2 block text-sm font-medium text-white/80">
                    Password
                </label>

                <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white/10"
                />
            </div>
            <div className="mb-6 flex justify-end">
                <button className="text-sm text-violet-400 transition hover:text-violet-300 hover:cursor-pointer">
                    Forgot Password?
                </button>
            </div>
            <button
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 font-semibold transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/30 hover:cursor-pointer"
            >
                Sign In
            </button>
            <div className="mt-3 mb-6 flex justify-end">
                <Link to="/" className="text-sm text-violet-400 transition hover:text-violet-300 hover:cursor-pointer">
                    Do not have an account? Create one
                </Link>
            </div>

        </div>
    );
}

export default LoginCard;