import {
    Rocket,
    Star,
    ChartColumn,
} from "lucide-react";

const user = JSON.parse(localStorage.getItem("user"));

const hour = new Date().getHours();


import bannerIllustration from "../../assets/dashboard/banner-illustration.png";

function WelcomeBanner() {
    return (
        <section
            className="
                relative
                overflow-hidden
                rounded-3xl
                bg-gradient-to-r
                from-[#EEF4FF]
                via-[#F6EEFF]
                to-[#FFEAF7]
                px-12
                py-10
                shadow-xl
            "
        >

            <div className="absolute -left-16 bottom-0 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />

            <div className="absolute right-10 bottom-0 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />

            <div className="absolute left-1/2 top-10 h-44 w-44 -translate-x-1/2 rounded-full bg-pink-300/10 blur-3xl" />


            <div className="absolute right-[26rem] top-6 rounded-2xl bg-white/70 p-4 shadow-lg backdrop-blur-md">
                <Rocket
                    size={24}
                    className="text-violet-600"
                />
            </div>

            <div className="absolute right-10 top-4 rounded-2xl bg-white/70 p-4 shadow-lg backdrop-blur-md">
                <Star
                    size={24}
                    className="fill-violet-500 text-violet-500"
                />
            </div>

            <div className="absolute right-4 bottom-10 rounded-2xl bg-white/70 p-4 shadow-lg backdrop-blur-md">
                <ChartColumn
                    size={24}
                    className="text-violet-600"
                />
            </div>


            <div className="relative flex items-center justify-between">


                <div className="max-w-2xl">
<h1 className="text-4xl font-bold text-slate-900 xl:text-5xl">
    Hi, {user?.fullName || user?.username}
</h1>

                    <p className="mt-5 text-lg leading-8 text-slate-600">
                        Explore startups perfectly matched to your skills,
                        discover exciting opportunities, and connect with
                        founders building the future.
                    </p>

                </div>


                <div className="hidden lg:flex">

                    <img
                        src={bannerIllustration}
                        alt="Banner Illustration"
                        className="w-[480px] object-contain"
                    />

                </div>

            </div>

        </section>
    );
}

export default WelcomeBanner;