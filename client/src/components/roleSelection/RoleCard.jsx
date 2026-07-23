import { motion } from "framer-motion";
import { memo } from "react";


const accentStyles = {
    purple: {
        border: "border-purple-400/20 hover:border-purple-400/40",
        glow: "bg-purple-500/20",
        shadow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
    },

    blue: {
        border: "border-blue-400/20 hover:border-blue-400/40",
        glow: "bg-blue-500/20",
        shadow: "hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]",
    },

    emerald: {
        border: "border-emerald-400/20 hover:border-emerald-400/40",
        glow: "bg-emerald-500/20",
        shadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.25)]",
    },
};

function RoleCard({
    title,
    description,
    image,
    accent,
    onClick,
    isSelected,
})  {

    const style = accentStyles[accent];

    return (


        <motion.div
            onClick={onClick}
            whileHover={{
                scale: 1.03,
            }}
            className={`
      group

      relative
      overflow-hidden

      w-64
      h-80

      rounded-[30px]

      bg-white/5
      backdrop-blur-2xl

      border
${isSelected ? "border-white/70 ring-2 ring-white/30" : style.border}

      shadow-xl
      ${style.shadow}

      transition-all
      duration-300

      cursor-pointer
      `}
        >


            <div
                className={`
        absolute
        top-8
        left-1/2
        -translate-x-1/2

        w-28
        h-28

        rounded-full
        blur-3xl

        ${style.glow}
        `}
            />



<div className="relative flex h-full flex-col items-center px-6 pt-8">

                <motion.img
                    src={image}
                    alt={title}
                    className="w-24 h-24 object-contain"
                    whileHover={{
                        scale: 1.08,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                    }}
                />

                <h2 className="mt-8 text-2xl font-semibold text-white">
                    {title}
                </h2>

<p className="mt-4 min-h-[72px] text-center text-sm leading-6 text-gray-400">
                    {description}
                </p>

            </div>
            <div
                className="
    pointer-events-none
    absolute
    inset-0
    overflow-hidden
    rounded-[30px]
  "
            >
                <div
                    className="
      absolute
      top-0
      -left-[120%]
      h-full
      w-1/2
      -skew-x-12
      bg-gradient-to-r
      from-transparent
      via-white/20
      to-transparent
      duration-1500
      group-hover:left-[150%]
    "
                />
            </div>

        </motion.div>


    );
}

export default memo(RoleCard);