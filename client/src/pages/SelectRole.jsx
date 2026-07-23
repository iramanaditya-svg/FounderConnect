import logo from "../assets/logo2.png";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import RoleCard from "../components/roleSelection/RoleCard";

import builderLogo from "../assets/startup-builder.png";
import professionalLogo from "../assets/professional.png";
import investorLogo from "../assets/investor.png";

import { selectRole } from "../services/api/auth.service";
import { useNavigate } from "react-router-dom";
function SelectRole() {
    const controls = useAnimationControls();
    const navigate = useNavigate();

    const [selectedRole, setSelectedRole] = useState(null);

    const [showCards, setShowCards] = useState(false);
    const [showContinue, setShowContinue] = useState(false);

    const [showHeading, setShowHeading] = useState(false);

    const [displayLine1, setDisplayLine1] = useState("");
    const [displayLine2, setDisplayLine2] = useState("");

    const [currentLine, setCurrentLine] = useState(1);

    const handleContinue = async () => {
        if (!selectedRole) return;

        try {
            await selectRole({
                role: selectedRole,
            });

            navigate("/complete-profile");
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const animateLogo = async () => {

            await controls.start({
                scale: 1,
                opacity: 1,
                transition: {
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                },
            });

            await controls.start({
                scale: 0.5,
                opacity: 1,
                y: 0,
                transition: {
                    duration: 1.3,
                    ease: [0.22, 1, 0.36, 1],
                },
            });

            setShowHeading(true);
        };

        animateLogo();
    }, [controls]);

    useEffect(() => {
        if (!showHeading) return;

        const heading = "Welcome to FounderConnect.";
        const subtitle =
            "Choose your primary role to personalize your experience on the platform.";

        const typingSpeedHeading = 45;
        const typingSpeedSubtitle = 20;

        if (currentLine === 1) {
            if (displayLine1.length < heading.length) {
                const timeout = setTimeout(() => {
                    setDisplayLine1(
                        heading.slice(0, displayLine1.length + 1)
                    );
                }, typingSpeedHeading);

                return () => clearTimeout(timeout);
            } else {
                setCurrentLine(2);
            }
        }

        if (currentLine === 2) {
            if (displayLine2.length < subtitle.length) {
                const timeout = setTimeout(() => {
                    setDisplayLine2(
                        subtitle.slice(0, displayLine2.length + 1)
                    );
                }, typingSpeedSubtitle);

                return () => clearTimeout(timeout);
            } else {
                const cardsTimeout = setTimeout(() => {
                    setShowCards(true);
                }, 50);

                const continueTimeout = setTimeout(() => {
                    setShowContinue(true);
                }, 1000);

                return () => {
                    clearTimeout(cardsTimeout);
                    clearTimeout(continueTimeout);
                };
            }
        }
    }, [showHeading, currentLine, displayLine1, displayLine2]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#050816]">


            <div className="absolute -top-52 -left-40 h-[450px] w-[450px] rounded-full bg-purple-700/25 blur-[140px]" />
            <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-[140px]" />
            <div className="absolute bottom-0 left-1/2 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-fuchsia-600/20 blur-[140px]" />


            <div className="relative z-10 flex min-h-screen flex-col items-center ">


                <motion.img
                    src={logo}
                    alt="FounderConnect Logo"
                    className="w-52"
                    initial={{
                        scale: 2,
                        opacity: 0,
                        y: 220,
                    }}
                    animate={controls}
                />


                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: showHeading ? 1 : 0,
                    }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center"
                >
                    <h1 className="text-5xl font-bold text-white text-center">
                        {displayLine1}
                    </h1>

                    <p className="mt-5 max-w-2xl text-center text-xl text-gray-400">
                        {displayLine2}
                    </p>
                </motion.div>
                <AnimatePresence>
                    {showCards && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 15,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                            }}
                            className="mt-16 grid grid-cols-3 gap-12"
                        >

                            <RoleCard
                                title="Startup Builder"
                                description="Build startups, hire talented people and raise investments."
                                image={builderLogo}
                                accent="purple"
                                isSelected={selectedRole === "startup_builder"}
                                onClick={() => setSelectedRole("startup_builder")}
                            />

                            <RoleCard
                                title="Professional"
                                description="Find exciting startup opportunities and collaborate with founders."
                                image={professionalLogo}
                                accent="blue"
                                isSelected={selectedRole === "professional"}
                                onClick={() => setSelectedRole("professional")}
                            />

                            <RoleCard
                                title="Investor"
                                description="Invest in promising startups and discover your next opportunity."
                                image={investorLogo}
                                accent="emerald"
                                isSelected={selectedRole === "investor"}
                                onClick={() => setSelectedRole("investor")}
                            />

                        </motion.div>
                    )
                    }
                    {showContinue && (
                        <motion.button
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            onClick={handleContinue}
                            disabled={!selectedRole}
                            className="mt-10 text-xl rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-20 py-2 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </motion.button>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

export default SelectRole;