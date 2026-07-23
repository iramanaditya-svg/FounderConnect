import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../services/api/auth.service";
import logo from "../../assets/logo.png";

function RegisterCard() {
    const navigate = useNavigate();

    const validateForm = () => {

    if((!formData.fullName.trim()) && (!formData.username.trim()) && (!formData.email.trim()) && (!formData.password.trim())){
        return "All fields are required";
    }
    else{

    if (!formData.fullName.trim()) {
        return "Full Name is required";
    }

    if (!formData.username.trim()) {
        return "Username is required";
    }

    if (!formData.email.trim()) {
        return "Email is required";
    }

    if (!formData.password.trim()) {
        return "Password is required";
    }
    }
    return null;
};

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");



    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError("");

        try {
            const response = await registerUser(formData);

            console.log(response);

            navigate("/select-role", {
            replace: true,
});

        } catch (error) {

            console.error(error);

            setError(error.response?.data?.message || "Something went wrong");
        }
    };
    return (
        <div className="p-8 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl bg-white/[0.06] border-white/15 shadow-2xl shadow-violet-500/10">

            <div className="mb-8 flex justify-center">
                <img
                    src={logo}
                    alt="FounderConnect Logo"
                    className="h-auto w-auto object-contain"
                />
            </div>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">
                    Welcome to FounderConnect
                </h1>

                <p className="mt-2 text-white/60">
                    Sign up to start building amazing startups.
                </p>



    {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
        </div>
    )}

            </div>

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-white/80">
                        Full Name
                    </label>

                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white/10"
                    />
                </div>
                <div className="mb-3">
                    <label className="mb-2 block text-sm font-medium text-white/80">
                        Username
                    </label>

                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white/10"
                    />
                </div>
                <div className="mb-5">
                    <label className="mb-2 block text-sm font-medium text-white/80">
                        Email Address
                    </label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 outline-none transition-all duration-300 focus:border-violet-500 focus:bg-white/10"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full mt-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 py-3 font-semibold transition duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/30 hover:cursor-pointer"
                >
                    Sign Up
                </button>

            </form>
            <div className="mb-2 flex justify-end">
                <Link to="/login" className="text-sm mt-3 text-violet-400 transition hover:cursor-pointer hover:text-violet-300">
                    Already have an account? Sign In
                </Link>
            </div>

        </div>
    );
}

export default RegisterCard;