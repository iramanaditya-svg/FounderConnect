import WelcomeBanner from "../../components/dashboard/WelcomeBanner";

function Home() {
    return (
        <div className="space-y-10">

            <WelcomeBanner />

            <section>

                <h2 className="text-3xl font-bold text-white">
                    Recommended Jobs
                </h2>

            </section>

            <section>

                <h2 className="text-3xl font-bold text-white">
                    Recommended Startups
                </h2>

            </section>

            <section>

                <h2 className="text-3xl font-bold text-white">
                    Latest Jobs
                </h2>

            </section>

        </div>
    );
}

export default Home;