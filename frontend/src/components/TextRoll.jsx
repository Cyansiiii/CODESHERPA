import { motion } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

const STAGGER = 0.035;

const TextRoll = ({ children, className, textClassName, center = false }) => {
    const text = typeof children === "string" ? children : String(children ?? "");
    const chars = text.split("");
    const springTransition = (delay) => ({
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.8,
        delay,
    });

    return (
        <motion.div
            initial="initial"
            whileHover="hovered"
            whileTap="hovered"
            variants={{
                initial: {
                    scale: 1,
                    filter: "brightness(1)",
                    textShadow: "0 0 0 rgba(99,102,241,0)",
                },
                hovered: {
                    scale: 1.025,
                    filter: "brightness(1.08)",
                    textShadow: "0 8px 24px rgba(99,102,241,0.3)",
                },
            }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={cn("relative inline-block overflow-hidden leading-none", className)}
            style={{ lineHeight: 0.95, perspective: 600 }}
        >
            <div>
                {chars.map((l, i) => {
                    const delay = center
                        ? STAGGER * Math.abs(i - (chars.length - 1) / 2)
                        : STAGGER * i;

                    return (
                        <motion.span
                            key={`top-${i}`}
                            variants={{
                                initial: { y: 0, rotateX: 0, opacity: 1 },
                                hovered: { y: "-112%", rotateX: -70, opacity: 0.45 },
                            }}
                            transition={springTransition(delay)}
                            className={cn("inline-block will-change-transform", textClassName)}
                        >
                            {l === " " ? "\u00A0" : l}
                        </motion.span>
                    );
                })}
            </div>

            <div className="absolute inset-0">
                {chars.map((l, i) => {
                    const delay = center
                        ? STAGGER * Math.abs(i - (chars.length - 1) / 2)
                        : STAGGER * i;

                    return (
                        <motion.span
                            key={`bottom-${i}`}
                            variants={{
                                initial: { y: "112%", rotateX: 70, opacity: 0.25 },
                                hovered: { y: 0, rotateX: 0, opacity: 1 },
                            }}
                            transition={springTransition(delay)}
                            className={cn("inline-block will-change-transform", textClassName)}
                        >
                            {l === " " ? "\u00A0" : l}
                        </motion.span>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default TextRoll;
