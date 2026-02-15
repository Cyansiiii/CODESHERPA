"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

// Helper components for the scroll animation

const CharacterV1 = ({
    char,
    index,
    centerIndex,
    scrollYProgress,
}) => {
    const isSpace = char === " ";
    const distanceFromCenter = index - centerIndex;

    // Adjusted ranges and output values for smoother, more subtle animation
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        [distanceFromCenter * 50, 0],
    );
    const rotateX = useTransform(
        scrollYProgress,
        [0, 1],
        [distanceFromCenter * 50, 0],
    );

    return (
        <motion.span
            className={cn("inline-block text-blue-500", isSpace && "w-4")}
            style={{
                x,
                rotateX,
            }}
        >
            {char}
        </motion.span>
    );
};

const CharacterV2 = ({
    char,
    index,
    centerIndex,
    scrollYProgress,
}) => {
    const isSpace = char === " ";
    const distanceFromCenter = index - centerIndex;

    const x = useTransform(
        scrollYProgress,
        [0, 1],
        [distanceFromCenter * 50, 0],
    );
    const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

    const y = useTransform(
        scrollYProgress,
        [0, 1],
        [Math.abs(distanceFromCenter) * 30, 0],
    );

    return (
        <motion.span
            className={cn("inline-block mx-1", isSpace && "w-4")}
            style={{
                x,
                scale,
                y,
                transformOrigin: "center",
            }}
        >
            {char}
        </motion.span>
    );
};

const Bracket = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 27 78"
            className={className}
        >
            <path
                fill="currentColor"
                d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
            ></path>
        </svg>
    );
};


const ScrollAnimationShowcase = () => {
    // --- Section 1: "CODESHERPA" (Text Animation) ---
    const targetRef1 = useRef(null);
    const { scrollYProgress: scrollYProgress1 } = useScroll({
        target: targetRef1,
        offset: ["start end", "end start"]
    });

    const text1 = "CODESHERPA";
    const chars1 = text1.split("");
    const centerIndex1 = Math.floor(chars1.length / 2);

    // --- Section 2: Tech Stack (Icon Animation - Adjusted for this demo to use icons) ---
    // Using Lucide icons or simple placeholders if images aren't available
    const targetRef2 = useRef(null);
    const { scrollYProgress: scrollYProgress2 } = useScroll({
        target: targetRef2,
        offset: ["start end", "end start"]
    });

    // We can use emojis or simple text for V2 demo if images are not ready
    const icons = ["⚛️", "🐍", "🚀", "💻", "🤖", "☁️", "🔐"];
    const iconCenterIndex = Math.floor(icons.length / 2);


    return (
        <div className="w-full bg-transparent text-white relative z-10">

            {/* Visual Indicator */}
            <div className="py-12 flex justify-center">
                <span className="relative text-xs uppercase opacity-40">
                    Scroll Down for Magic
                </span>
            </div>

            {/* --- Animation 1: Text Spread --- */}
            <div
                ref={targetRef1}
                className="relative min-h-[150vh] flex items-center justify-center overflow-hidden"
            >
                {/* Sticky container to keep content in view while we scroll through the height */}
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center">
                    <h2 className="text-xl md:text-3xl font-bold mb-12 text-gray-500">
                        The Future of Coding
                    </h2>
                    <div
                        className="flex flex-wrap justify-center text-6xl md:text-9xl font-black uppercase tracking-tighter"
                        style={{ perspective: "500px" }}
                    >
                        {chars1.map((char, index) => (
                            <CharacterV1
                                key={index}
                                char={char}
                                index={index}
                                centerIndex={centerIndex1}
                                scrollYProgress={scrollYProgress1}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Animation 2: Icons/Items Arc --- */}
            <div
                ref={targetRef2}
                className="relative min-h-[150vh] flex items-center justify-center overflow-hidden"
            >
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-8">
                    <div className="flex items-center justify-center gap-4 text-2xl md:text-4xl text-gray-300">
                        <Bracket className="h-12 w-auto" />
                        <span className="font-bold">Powered By Modern Stack</span>
                        <Bracket className="h-12 w-auto scale-x-[-1]" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-6xl md:text-8xl">
                        {icons.map((item, index) => (
                            <CharacterV2
                                key={index}
                                char={item}
                                index={index}
                                centerIndex={iconCenterIndex}
                                scrollYProgress={scrollYProgress2}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ScrollAnimationShowcase;
