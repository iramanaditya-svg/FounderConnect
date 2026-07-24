import ProfessionalForm from "../components/completeProfile/ProfessionalForm";

function CompleteProfile() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050816]">


            <div className="absolute -top-44 -left-36 h-[420px] w-[420px] rounded-full bg-blue-600/15 blur-[140px]" />

            <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />

            <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[180px]" />


            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, white 1px, transparent 1px),
                        linear-gradient(to bottom, white 1px, transparent 1px)
                    `,
                    backgroundSize: "70px 70px",
                }}
            />


            <div className="relative z-10 flex min-h-screen flex-col px-6 py-10">

                <div className="mx-auto flex w-full max-w-6xl items-center justify-between">

                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Complete Profile
                        </h1>

                        <p className="mt-2 text-gray-400">
                            Build your professional profile and let founders discover your talent.
                        </p>
                    </div>

                    <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2">
                        <span className="text-sm font-medium text-blue-300">
                            Professional Profile
                        </span>
                    </div>

                </div>

                <ProfessionalForm />

            </div>
        </div>
    );
}

export default CompleteProfile;