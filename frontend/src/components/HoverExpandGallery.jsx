"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const HoverExpandGallery = ({
    items,
    className,
}) => {
    const centerIndex = Math.max(0, Math.floor((items.length - 1) / 2));
    const [activeItem, setActiveItem] = useState(centerIndex);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                delay: 0.2,
            }}
            className={cn("w-full max-w-7xl mx-auto px-4", className)}
        >
            <div className="hidden xl:flex w-full h-[540px] items-stretch justify-center gap-4">
                {items.map((item, index) => {
                    const isActive = activeItem === index;
                    return (
                        <motion.div
                            key={index}
                            className={cn(
                                "group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/15",
                                "bg-gradient-to-br backdrop-blur-xl transition-all duration-500",
                                "shadow-[0_20px_45px_-25px_rgba(0,0,0,0.85)]",
                                isActive
                                    ? "ring-1 ring-blue-300/30 shadow-[0_24px_55px_-20px_rgba(99,102,241,0.65)]"
                                    : "hover:ring-1 hover:ring-blue-300/25 hover:shadow-[0_24px_55px_-20px_rgba(99,102,241,0.45)]",
                                item.color ? item.color : "from-slate-700/70 to-slate-900/80"
                            )}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            animate={{
                                flex: isActive ? 2.8 : 1,
                                y: [0, -8, 0],
                            }}
                            transition={{
                                flex: { duration: 0.45, ease: "easeInOut" },
                                y: {
                                    duration: 5.6 + index * 0.25,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: index * 0.08,
                                },
                                opacity: { duration: 0.45 },
                            }}
                            onHoverStart={() => setActiveItem(index)}
                            onClick={() => setActiveItem(index)}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="absolute inset-0 bg-black/35" />
                            <div className="absolute -inset-14 bg-gradient-to-tr from-blue-500/0 via-indigo-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500" />
                            <div className="absolute top-5 right-5 w-40 h-40 rounded-full bg-white/10 blur-3xl opacity-40" />

                            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none scale-[1.75]">
                                {React.cloneElement(item.icon, { className: "w-52 h-52" })}
                            </div>

                            <AnimatePresence mode="wait">
                                {isActive ? (
                                    <motion.div
                                        key="active"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.22 }}
                                        className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
                                    >
                                        <div className="mb-5 text-white group-hover:scale-105 transition-transform duration-300 origin-left">
                                            {React.cloneElement(item.icon, { className: "w-14 h-14" })}
                                        </div>
                                        <h3 className="text-[1.85rem] leading-tight font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-100/90 text-base leading-relaxed max-w-xl">
                                            {item.description}
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="inactive"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center p-5"
                                    >
                                        <div className="mb-4 text-white/80 group-hover:scale-110 transition-transform duration-300">
                                            {React.cloneElement(item.icon, { className: "w-11 h-11" })}
                                        </div>
                                        <h3 className="text-lg font-semibold text-white/75 text-center group-hover:text-white transition-colors duration-300">
                                            {item.title}
                                        </h3>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 22 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            opacity: { duration: 0.5, delay: index * 0.06 },
                            y: {
                                duration: 5 + index * 0.2,
                                repeat: Infinity,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            },
                        }}
                        animate={{ y: [0, -6, 0] }}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border border-white/15",
                            "bg-gradient-to-br backdrop-blur-xl p-7 md:p-8",
                            "transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]",
                            "hover:ring-1 hover:ring-blue-300/35 hover:shadow-[0_22px_45px_-22px_rgba(99,102,241,0.7)]",
                            item.color ? item.color : "from-slate-700/70 to-slate-900/80"
                        )}
                    >
                        <div className="absolute inset-0 bg-black/35" />
                        <div className="absolute -top-10 right-0 w-28 h-28 rounded-full bg-white/15 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="relative z-10">
                            <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 mb-5 text-white group-hover:scale-110 transition-transform duration-300">
                                {React.cloneElement(item.icon, { className: "w-12 h-12" })}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
                                {item.title}
                            </h3>
                            <p className="text-slate-100/85 leading-relaxed text-[0.95rem]">
                                {item.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default HoverExpandGallery;
