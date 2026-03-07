import React from "react";
import { motion } from "framer-motion";
import { Brain, Search, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const cards = [
    {
        id: "01",
        role: "Master Router",
        name: "Orchestrator",
        tag: "Intent Router",
        icon: Settings,
        desc: "Intelligently routes your requests to the right specialist agent with context-aware classification.",
        stat: "99.2%",
        statLabel: "routing precision",
        tint: "bg-blue-400/10",
        border: "border-white/20",
        glow: "rgba(59,130,246,0.28)",
        iconBg: "bg-blue-500/15 border-blue-400/40",
        tagBg: "bg-blue-500/15 border-blue-400/35 text-blue-200",
        accent: "text-blue-400",
        divider: "bg-gradient-to-r from-blue-400/70 to-transparent",
        bottom: "bg-gradient-to-r from-blue-400 to-transparent",
    },
    {
        id: "02",
        role: "Code Reviewer",
        name: "Review Monk",
        tag: "OWASP Top 10",
        icon: Search,
        desc: "Deep analysis of PRs - catches bugs, security flaws, and style violations with surgical precision.",
        stat: "28",
        statLabel: "bugs prevented avg/month",
        tint: "bg-purple-400/10",
        border: "border-white/20",
        glow: "rgba(139,92,246,0.28)",
        iconBg: "bg-purple-500/15 border-purple-400/40",
        tagBg: "bg-purple-500/15 border-purple-400/35 text-purple-200",
        accent: "text-purple-400",
        divider: "bg-gradient-to-r from-purple-400/70 to-transparent",
        bottom: "bg-gradient-to-r from-purple-400 to-transparent",
    },
    {
        id: "03",
        role: "Learning Guide",
        name: "Code Sherpa",
        tag: "Hindi + Hinglish",
        icon: Brain,
        desc: "Explains complex concepts in Hindi, English or Hinglish with culturally relevant analogies.",
        stat: "5min",
        statLabel: "avg concept clarity time",
        tint: "bg-orange-400/10",
        border: "border-white/20",
        glow: "rgba(249,115,22,0.28)",
        iconBg: "bg-orange-500/15 border-orange-400/40",
        tagBg: "bg-orange-500/15 border-orange-400/35 text-orange-200",
        accent: "text-orange-400",
        divider: "bg-gradient-to-r from-orange-400/70 to-transparent",
        bottom: "bg-gradient-to-r from-orange-400 to-transparent",
    },
    {
        id: "04",
        role: "Vulnerability Scanner",
        name: "Security Guard",
        tag: "Zero-Day Detection",
        icon: Shield,
        desc: "Proactive scanning for secrets, injections, and AWS misconfigurations before they hit production.",
        stat: "100%",
        statLabel: "OWASP coverage",
        tint: "bg-emerald-400/10",
        border: "border-white/20",
        glow: "rgba(34,197,94,0.28)",
        iconBg: "bg-emerald-500/15 border-emerald-400/40",
        tagBg: "bg-emerald-500/15 border-emerald-400/35 text-emerald-200",
        accent: "text-emerald-400",
        divider: "bg-gradient-to-r from-emerald-400/70 to-transparent",
        bottom: "bg-gradient-to-r from-emerald-400 to-transparent",
    },
];

const particleDelays = [0, 0.25, 0.5, 0.75, 1, 1.2, 1.45, 1.7];

const handleMove = (e, glow) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const tiltX = -dy * 18;
    const tiltY = dx * 18;

    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04)`;
    card.style.transition = "transform 0.08s ease, box-shadow 0.4s ease";
    card.style.boxShadow = `0 20px 60px rgba(0,0,0,0.45), 0 0 0 1px ${glow}, 0 0 48px ${glow}`;

    const orb = card.querySelector(".agent-glow-orb");
    if (orb) {
        const orbX = 50 + dx * 28;
        const orbY = 50 + dy * 28;
        orb.style.left = `${orbX}%`;
        orb.style.top = `${orbY}%`;
    }
};

const AgentsShowcase = ({ className }) => {
    return (
        <section className={cn("relative z-10 py-24 px-4 overflow-hidden", className)}>
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_500px_at_50%_0%,rgba(88,28,235,0.28),transparent_70%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_500px_400px_at_90%_50%,rgba(59,130,246,0.08),transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_400px_350px_at_5%_70%,rgba(99,102,241,0.08),transparent_60%)]" />
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:72px_72px]" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <p className="inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-semibold text-blue-300 mb-4">
                        <span className="w-8 h-px bg-blue-300/90" />
                        Specialized Agents
                        <span className="w-8 h-px bg-blue-300/90" />
                    </p>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200">
                        Meet Your AI Team
                    </h2>
                    <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Four specialized agents working in harmony - each an expert in its domain.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    {cards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={card.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.55, delay: 0.2 + index * 0.12 }}
                                className={cn(
                                    "agent-glass-card group relative rounded-3xl p-7 border overflow-hidden",
                                    "bg-white/[0.04] backdrop-blur-xl shadow-[0_10px_32px_rgba(0,0,0,0.38)] [transform-style:preserve-3d]",
                                    card.border
                                )}
                                onMouseMove={(e) => handleMove(e, card.glow)}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                                    e.currentTarget.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease";
                                    e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.38)";
                                    const orb = e.currentTarget.querySelector(".agent-glow-orb");
                                    if (orb) {
                                        orb.style.left = "50%";
                                        orb.style.top = "50%";
                                    }
                                }}
                            >
                                <div className="agent-glow-orb" />
                                <div className="agent-particles">
                                    {particleDelays.map((delay, i) => (
                                        <span
                                            key={i}
                                            className="agent-particle"
                                            style={{
                                                left: `${12 + i * 10}%`,
                                                animationDelay: `${delay}s`,
                                            }}
                                        />
                                    ))}
                                </div>
                                <div className="pointer-events-none absolute inset-0 opacity-80 bg-gradient-to-b from-white/[0.08] to-white/[0.01]" />
                                <div className={cn("pointer-events-none absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300", card.tint)} />
                                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.10),transparent_60%)]" />
                                <div className={cn("absolute top-4 right-5 text-7xl font-black opacity-5", card.accent)}>
                                    {card.id}
                                </div>

                                <div className="agent-card-inner relative z-10">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={cn("w-14 h-14 rounded-2xl border grid place-items-center", card.iconBg)}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className={cn("px-3 py-1 rounded-full border text-[10px] font-semibold tracking-[0.08em] uppercase", card.tagBg)}>
                                            {card.tag}
                                        </span>
                                    </div>

                                    <p className={cn("text-[11px] uppercase tracking-[0.14em] font-bold mb-1", card.accent)}>
                                        {card.role}
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-100 mb-3 group-hover:text-white transition-colors">
                                        {card.name}
                                    </h3>
                                    <p className="text-sm text-white/45 leading-7 mb-6 group-hover:text-white/60 transition-colors">
                                        {card.desc}
                                    </p>

                                    <div className={cn("h-px mb-5", card.divider)} />

                                    <div className="flex items-end gap-3">
                                        <span className={cn("text-3xl font-black leading-none", card.accent)}>{card.stat}</span>
                                        <span className="text-xs text-white/35 pb-1">{card.statLabel}</span>
                                    </div>
                                </div>

                                <div className={cn("absolute bottom-0 left-0 right-0 h-[2px] opacity-40 group-hover:opacity-100 transition-opacity", card.bottom)} />
                            </motion.div>
                        );
                    })}
                </div>

                <p className="text-center mt-10 text-[11px] tracking-[0.2em] uppercase text-slate-700">
                    Powered by Specialized Multi-Agent Systems · AWS Bedrock + Claude 3.5 Sonnet
                </p>
            </div>
        </section>
    );
};

export default AgentsShowcase;
