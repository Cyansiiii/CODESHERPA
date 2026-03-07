"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";
import {
    Atom,
    Braces,
    Cloud,
    Cpu,
    FileCode2,
    Rocket,
    ShieldCheck,
} from "lucide-react";

const CharacterV1 = ({ char, index, centerIndex, scrollYProgress }) => {
    const isSpace = char === " ";
    const distanceFromCenter = index - centerIndex;

    const x = useTransform(scrollYProgress, [0, 1], [distanceFromCenter * 48, 0]);
    const y = useTransform(scrollYProgress, [0, 1], [Math.abs(distanceFromCenter) * 22, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0, 0.7, 1]);

    return (
        <motion.span
            className={`inline-block bg-clip-text text-transparent bg-gradient-to-b from-blue-300 via-indigo-300 to-purple-400 ${isSpace ? "w-4" : ""}`}
            style={{
                x,
                y,
                opacity,
            }}
        >
            {char}
        </motion.span>
    );
};

const techStack = [
    { name: "React", icon: Atom },
    { name: "Python", icon: Braces },
    { name: "FastAPI", icon: Rocket },
    { name: "TypeScript", icon: FileCode2 },
    { name: "AWS Bedrock", icon: Cpu },
    { name: "Cloudflare", icon: Cloud },
    { name: "Auth.js", icon: ShieldCheck },
];

const ScrollAnimationShowcase = () => {
    const targetRef1 = useRef(null);
    const { scrollYProgress: scrollYProgress1 } = useScroll({
        target: targetRef1,
        offset: ["start end", "end start"],
    });

    const targetRef2 = useRef(null);

    const text1 = "CODESHERPA";
    const chars1 = text1.split("");
    const centerIndex1 = Math.floor(chars1.length / 2);

    return (
        <div className="w-full bg-transparent text-white relative z-10">
            <div className="py-12 flex justify-center">
                <span className="relative text-xs uppercase tracking-[0.22em] opacity-40">
                    Scroll Down for Magic
                </span>
            </div>

            <div
                ref={targetRef1}
                className="relative min-h-[140vh] flex items-center justify-center overflow-hidden"
            >
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative text-center mb-12"
                    >
                        <div className="future-title-glow" />
                        <h2 className="relative text-xl md:text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300">
                            The Future of Coding
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.75 }}
                        className="flex flex-wrap justify-center text-6xl md:text-9xl font-black uppercase tracking-tighter"
                        style={{ perspective: "700px" }}
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
                    </motion.div>
                </div>
            </div>

            <div
                ref={targetRef2}
                className="relative min-h-[140vh] flex items-center justify-center overflow-hidden"
            >
                <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-4 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="text-center mb-10"
                    >
                        <h3 className="text-2xl md:text-4xl font-bold text-slate-100 tracking-tight">
                            Powered by Modern Stack
                        </h3>
                    </motion.div>

                    <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5">
                        {techStack.map((tech, index) => {
                            const Icon = tech.icon;
                            return (
                                <motion.div
                                    key={tech.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.55, delay: index * 0.05 }}
                                    className="stack-tech-card rounded-2xl p-4 md:p-5 text-center"
                                >
                                    <div className="stack-tech-icon-wrap mx-auto mb-3">
                                        <Icon
                                            className="w-6 h-6 md:w-7 md:h-7 text-blue-200 stack-icon-float"
                                            style={{ animationDelay: `${index * 0.22}s` }}
                                        />
                                    </div>
                                    <p className="text-xs md:text-sm font-medium text-slate-200 leading-tight">
                                        {tech.name}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollAnimationShowcase;
