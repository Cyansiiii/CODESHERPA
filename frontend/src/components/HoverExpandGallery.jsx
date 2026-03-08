"use client";

import { motion } from "framer-motion";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const HoverExpandGallery = ({
    items,
    className,
}) => {
    const [activeItem, setActiveItem] = useState(0);
    const itemCount = items.length;
    const displayItems = useMemo(
        () =>
            items.map((item, index) => ({
                ...item,
                idx: String(index + 1).padStart(2, "0"),
                wm: String(index + 1),
                tag: item.tag || "Platform Capability",
            })),
        [items]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                delay: 0.2,
            }}
            className={cn("w-full max-w-7xl mx-auto px-4", className)}
        >
            <div className="flex w-full flex-col gap-3 md:h-[560px] md:flex-row md:gap-2">
                {displayItems.map((item, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ y: -4 }}
                        className={cn(
                            "group relative cursor-pointer overflow-hidden rounded-3xl border border-white/10",
                            "min-h-[210px] md:min-h-0",
                            "bg-gradient-to-br transition-all duration-500 ease-in-out",
                            item.color ? item.color : "from-gray-800 to-gray-900",
                            activeItem === index ? "border-white/25" : "border-white/10"
                        )}
                        initial={{ flex: 1, opacity: 0, y: 24 }}
                        animate={{
                            flex: activeItem === index ? 3.3 : 1,
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.06 }}
                        onHoverStart={() => setActiveItem(index)}
                        onClick={() => setActiveItem(index)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-black/55" />
                        <motion.div
                            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
                            animate={{ scaleX: activeItem === index ? 1 : 0 }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{ transformOrigin: "center" }}
                        />
                        <motion.div
                            className="pointer-events-none absolute -left-[75%] top-[-50%] h-[200%] w-1/2 bg-[linear-gradient(105deg,transparent,rgba(255,255,255,0.13),transparent)]"
                            style={{ transform: "skewX(-20deg)" }}
                            animate={{ left: activeItem === index ? "130%" : "-75%" }}
                            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                        <motion.div
                            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.35)_0%,transparent_68%)] mix-blend-screen"
                            animate={{ opacity: activeItem === index ? 0.2 : 0, scale: activeItem === index ? 1.2 : 1 }}
                            transition={{ duration: 0.6 }}
                        />

                        <span className="absolute left-6 top-5 font-serif text-[11px] tracking-[0.22em] text-white/30">
                            {item.idx}
                        </span>

                        <motion.div
                            className="absolute right-5 top-5 grid h-10 w-10 place-items-center border border-white/15 bg-black/15 text-white/60"
                            animate={{ rotate: activeItem === index ? 8 : 0, borderColor: activeItem === index ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.15)" }}
                            transition={{ duration: 0.3 }}
                        >
                            {React.cloneElement(item.icon, { className: "h-4 w-4" })}
                        </motion.div>

                        <div className="pointer-events-none absolute -bottom-8 right-0 select-none font-serif text-[8.5rem] font-black leading-none text-white/[0.05]">
                            {item.wm}
                        </div>

                        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                            <motion.div
                                className="mb-2 inline-flex w-fit items-center gap-2 border border-white/30 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/85"
                                animate={{ opacity: activeItem === index ? 1 : 0, x: activeItem === index ? 0 : -10 }}
                                transition={{ duration: 0.25 }}
                            >
                                <span className="h-1 w-1 rounded-full bg-white/90" />
                                {item.tag}
                            </motion.div>

                            <motion.div
                                className="mb-3 h-px bg-gradient-to-r from-white/70 to-transparent"
                                animate={{ width: activeItem === index ? 44 : 0 }}
                                transition={{ duration: 0.45, delay: 0.08 }}
                            />

                            <h3 className={cn(
                                "font-serif text-white tracking-tight",
                                activeItem === index ? "text-3xl md:text-4xl" : "text-xl md:text-lg"
                            )}>
                                {item.title}
                            </h3>

                            <motion.p
                                className="mt-3 max-w-[38ch] text-sm leading-relaxed text-white/78"
                                animate={{
                                    opacity: activeItem === index ? 1 : 0,
                                    y: activeItem === index ? 0 : 10,
                                    height: activeItem === index ? "auto" : 0,
                                }}
                                transition={{ duration: 0.25 }}
                            >
                                {item.description}
                            </motion.p>
                        </div>

                        <motion.div
                            className="absolute bottom-6 right-6 grid h-8 w-8 place-items-center border border-white/20 bg-black/20"
                            animate={{
                                opacity: activeItem === index ? 1 : 0,
                                x: activeItem === index ? 0 : 8,
                                y: activeItem === index ? 0 : 8,
                            }}
                            transition={{ duration: 0.25 }}
                        >
                            <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M2 10L10 2M4 2h6v6" />
                            </svg>
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    {itemCount} core capabilities engineered for developers
                </span>
                <button className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.18em] text-cyan-300">
                    Explore all features
                    <span className="h-px w-6 bg-gradient-to-r from-cyan-300 to-transparent transition-all duration-300 group-hover:w-10" />
                </button>
            </div>
        </motion.div>
    );
};

export default HoverExpandGallery;
