import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Sparkles, ArrowRight, Code2, Brain, Zap, Shield,
    Globe, Github, CheckCircle2, Users, Award, Rocket, Bug, Database, Cloud, Bot, Terminal,
    BadgeCheck, MessageCircle, Repeat2, Heart
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AgentsShowcase from '../components/AgentsShowcase'
import LogoLoop from '../components/LogoLoop'
import StatsCounter from '../components/StatsCounter'
import DarkVeil from '../components/DarkVeil'

// ... existing imports

const HoverStat = ({ label, baseValue, hoverValue, formatValue }) => {
    const [displayValue, setDisplayValue] = useState(baseValue)
    const frameRef = useRef(null)
    const animateValue = (target) => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
        const startValue = displayValue
        const duration = 420
        const startTime = performance.now()
        const tick = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const next = startValue + (target - startValue) * eased
            setDisplayValue(next)
            if (progress < 1) frameRef.current = requestAnimationFrame(tick)
        }
        frameRef.current = requestAnimationFrame(tick)
    }
    useEffect(() => () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }, [])
    return (
        <motion.div
            onMouseEnter={() => animateValue(hoverValue)}
            onMouseLeave={() => animateValue(baseValue)}
            whileHover={{ y: -3, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="text-center"
        >
            <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200 mb-2">
                {formatValue(displayValue)}
            </p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-slate-600">{label}</p>
        </motion.div>
    )
}

const HomePage = () => {
    const navigate = useNavigate()
    const workflowParticleDelays = [0, 0.25, 0.5, 0.75, 1, 1.2, 1.45, 1.7]

    const handleWorkflowMove = (e, glow) => {

        const card = e.currentTarget
        const rect = card.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = (e.clientX - cx) / (rect.width / 2)
        const dy = (e.clientY - cy) / (rect.height / 2)
        const tiltX = -dy * 16
        const tiltY = dx * 16

        card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.03)`
        card.style.transition = 'transform 0.08s ease, box-shadow 0.4s ease'
        card.style.boxShadow = `0 18px 50px rgba(0,0,0,0.4), 0 0 0 1px ${glow}, 0 0 42px ${glow}`

        const orb = card.querySelector('.workflow-glow-orb')
        if (orb) {
            const orbX = 50 + dx * 28
            const orbY = 50 + dy * 28
            orb.style.left = `${orbX}%`
            orb.style.top = `${orbY}%`
        }
    }

    const stats = [
        { value: 10000, suffix: "+", label: "Lines of Code Reviewed", icon: <Code2 className="text-blue-400" /> },
        { value: 500, suffix: "+", label: "Bugs Prevented", icon: <Shield className="text-green-400" /> },
        { value: 1000, suffix: "+", label: "Developers Helped", icon: <Users className="text-purple-400" /> },
        { value: 99, suffix: "%", label: "Satisfaction Rate", icon: <Award className="text-yellow-400" /> }
    ]

    const workflowSteps = [
        {
            num: "01",
            icon: "ðŸ“‹",
            label: "Input",
            labelColor: "text-blue-300",
            title: "Paste Code",
            desc: "Drop your code, PR link, or GitHub repo URL. Supports 40+ languages.",
            tags: ["Python", "JS", "Go", "Java"],
            tagClass: "border-blue-400/25 text-blue-300 bg-blue-500/10",
            nodeBg: "from-blue-700 to-blue-500",
            cardBorder: "border-blue-400/25 hover:border-blue-400/45",
            cardGlow: "hover:shadow-[0_20px_40px_rgba(59,130,246,0.08)]",
            glowColor: "rgba(59,130,246,0.22)",
            stat: "40+",
            statLabel: "languages supported"
        },
        {
            num: "02",
            icon: "ðŸ¤–",
            label: "Orchestrator",
            labelColor: "text-purple-300",
            title: "AI Analysis",
            desc: "Orchestrator agent classifies intent and routes to the right specialist with 99.2% accuracy.",
            tags: ["Claude 3.5", "AWS Bedrock"],
            tagClass: "border-purple-400/25 text-purple-300 bg-purple-500/10",
            nodeBg: "from-violet-700 to-purple-500",
            cardBorder: "border-purple-400/25 hover:border-purple-400/45",
            cardGlow: "hover:shadow-[0_20px_40px_rgba(139,92,246,0.08)]",
            glowColor: "rgba(139,92,246,0.22)",
            stat: "99.2%",
            statLabel: "routing accuracy"
        },
        {
            num: "03",
            icon: "ðŸ›",
            label: "Review Monk",
            labelColor: "text-orange-300",
            title: "Bug Detection",
            desc: "Deep PR analysis catches logic errors, code smells, and style violations instantly.",
            tags: ["Logic Errors", "Smells"],
            tagClass: "border-orange-400/25 text-orange-300 bg-orange-500/10",
            nodeBg: "from-orange-700 to-orange-500",
            cardBorder: "border-orange-400/25 hover:border-orange-400/45",
            cardGlow: "hover:shadow-[0_20px_40px_rgba(249,115,22,0.08)]",
            glowColor: "rgba(249,115,22,0.22)",
            stat: "28",
            statLabel: "bugs caught avg/month"
        },
        {
            num: "04",
            icon: "ðŸ›¡ï¸",
            label: "Security Guard",
            labelColor: "text-green-300",
            title: "Security Check",
            desc: "OWASP Top 10 scanner detects injections, secrets, and AWS misconfigurations.",
            tags: ["OWASP", "CVE Scan"],
            tagClass: "border-emerald-400/25 text-emerald-300 bg-emerald-500/10",
            nodeBg: "from-emerald-700 to-green-500",
            cardBorder: "border-emerald-400/25 hover:border-emerald-400/45",
            cardGlow: "hover:shadow-[0_20px_40px_rgba(34,197,94,0.08)]",
            glowColor: "rgba(34,197,94,0.22)",
            stat: "100%",
            statLabel: "OWASP coverage"
        },
        {
            num: "05",
            icon: "âœ…",
            label: "Output",
            labelColor: "text-cyan-300",
            title: "Optimized Code",
            desc: "Get actionable fixes, explanations in Hindi/English, and a quality score.",
            tags: ["Hindi", "Quality Score"],
            tagClass: "border-cyan-400/25 text-cyan-300 bg-cyan-500/10",
            nodeBg: "from-cyan-700 to-cyan-500",
            cardBorder: "border-cyan-400/25 hover:border-cyan-400/45",
            cardGlow: "hover:shadow-[0_20px_40px_rgba(6,182,212,0.08)]",
            glowColor: "rgba(6,182,212,0.22)",
            stat: "9.4/10",
            statLabel: "avg quality score"
        }
    ]

    const tweetWall = [
        {
            avatar: "RS", avatarClass: "from-blue-700 to-blue-500", name: "Rahul Sharma", verified: true, handle: "@rahul_dev_tcs",
            chips: ["TCS", "Senior Dev"], glow: "hover:shadow-[inset_0_0_30px_rgba(59,130,246,0.08)]",
            body: "Just found a critical SQL injection in our prod codebase thanks to @CodeSherpa. This vulnerability had been sitting there for 2 years undetected.",
            tag: "Security Win", tagClass: "border-blue-400/25 text-blue-300 bg-blue-500/10",
            comments: "47", reposts: "128", likes: "892", time: "Mar 5, 2026"
        },
        {
            avatar: "PP", avatarClass: "from-violet-700 to-purple-500", name: "Priya Patel", verified: false, handle: "@priya_techlead",
            chips: ["Infosys", "Tech Lead"], glow: "hover:shadow-[inset_0_0_30px_rgba(139,92,246,0.08)]",
            body: "Hindi mode is wild. I asked async/await and got a chai analogy that my entire fresher batch understood instantly.",
            tag: "Hinglish Mode", tagClass: "border-purple-400/25 text-purple-300 bg-purple-500/10",
            comments: "83", reposts: "214", likes: "1.4K", time: "Mar 4, 2026"
        },
        {
            avatar: "MS", avatarClass: "from-emerald-700 to-green-500", name: "Manish Singh", verified: true, handle: "@manish_paytm_eng",
            chips: ["Paytm", "Lead Eng"], glow: "hover:shadow-[inset_0_0_30px_rgba(34,197,94,0.08)]",
            body: "CodeSherpa reviewed this and gave 9.2/10 quality score. It flagged missing input validation in seconds.",
            code: [
                "# flagged: missing validation",
                "def process_payment(user_id, amount):",
                "  query = f\"SELECT * FROM users WHERE id={user_id}\"",
                "  # fix: use parameterized query"
            ],
            tag: "Code Quality: 9.2/10", tagClass: "border-green-400/25 text-green-300 bg-green-500/10",
            comments: "62", reposts: "189", likes: "743", time: "Mar 3, 2026"
        },
        {
            avatar: "AK", avatarClass: "from-orange-700 to-orange-500", name: "Amit Kumar", verified: false, handle: "@amit_freelance_dev",
            chips: ["Freelance"], glow: "hover:shadow-[inset_0_0_30px_rgba(249,115,22,0.08)]",
            body: "Sent a PR link on WhatsApp and got full review in 40 seconds while commuting. Truly built for India.",
            tag: "WhatsApp Integration", tagClass: "border-orange-400/25 text-orange-300 bg-orange-500/10",
            comments: "31", reposts: "97", likes: "2.1K", time: "Mar 6, 2026"
        },
        {
            avatar: "ST", avatarClass: "from-pink-700 to-pink-500", name: "Sonal Trivedi", verified: true, handle: "@sonal_ola_em",
            chips: ["Ola", "Eng Manager"], glow: "hover:shadow-[inset_0_0_30px_rgba(236,72,153,0.08)]",
            body: "Review cycle dropped from 2 days to under 4 hours after GitHub webhook integration with CodeSherpa.",
            tag: "75% faster reviews", tagClass: "border-purple-400/25 text-purple-300 bg-purple-500/10",
            comments: "104", reposts: "387", likes: "3.2K", time: "Mar 1, 2026"
        },
        {
            avatar: "NC", avatarClass: "from-cyan-700 to-cyan-500", name: "Neha Chaudhary", verified: false, handle: "@neha_sec_eng",
            chips: ["Juspay", "Security Eng"], glow: "hover:shadow-[inset_0_0_30px_rgba(6,182,212,0.08)]",
            body: "Quick PR check found a hardcoded AWS key that had been in the repo for 4 months. Install this now.",
            comments: "156", reposts: "512", likes: "4.8K", time: "Feb 28, 2026"
        }
    ]

    const communityStats = [
        {
            label: "Active Devs",
            baseValue: 5000,
            hoverValue: 5600,
            formatValue: (v) => Math.round(v).toLocaleString() + "+"
        },
        {
            label: "Avg Rating",
            baseValue: 4.9,
            hoverValue: 5.0,
            formatValue: (v) => v.toFixed(1) + "★"
        },
        {
            label: "PRs Reviewed",
            baseValue: 50000,
            hoverValue: 58000,
            formatValue: (v) => Math.round(v / 1000) + "K+"
        },
        {
            label: "Savings",
            baseValue: 2.0,
            hoverValue: 2.4,
            formatValue: (v) => "₹" + v.toFixed(1).replace(".0", "") + "Cr+"
        }
    ]

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 overflow-hidden relative selection:bg-indigo-500/30">
            {/* Ambient Background Glow - using DarkVeil */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <DarkVeil />
                {/* Optional overlays on top of DarkVeil if desired, but DarkVeil is the main bg */}
                <div className="absolute inset-0 bg-grid-white opacity-[0.02]" />
            </div>

            <Navbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 overflow-hidden">
                <div className="pointer-events-none absolute inset-0">
                    <div className="hero-light-orb absolute top-[18%] left-[14%] w-72 h-72 bg-blue-500/15 rounded-full blur-3xl" />
                    <div className="hero-light-orb-delayed absolute bottom-[18%] right-[12%] w-80 h-80 bg-purple-500/18 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(99,102,241,0.12),transparent_52%)]" />
                </div>
                <div className="relative z-10 max-w-7xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full mb-8 border border-indigo-300/20 shadow-[0_0_35px_-18px_rgba(99,102,241,0.8)]"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                        <span className="text-[11px] md:text-xs font-semibold tracking-[0.16em] text-slate-200 uppercase">
                            POWERED BY AWS BEDROCK & CLAUDE 3.5 SONNET
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                        className="text-6xl md:text-9xl font-black mb-6 leading-[0.9] tracking-tight text-white relative z-20"
                    >
                        <div className="relative inline-block">
                            <span className="pointer-events-none absolute inset-0 blur-2xl opacity-75 bg-[radial-gradient(circle_at_50%_56%,rgba(99,102,241,0.55),transparent_62%)]" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-slate-300/70 pb-2 font-black text-6xl md:text-9xl tracking-tight leading-[0.9] drop-shadow-[0_0_30px_rgba(99,102,241,0.35)]">
                                CODESHERPA
                            </span>
                        </div>
                        <br />
                        <span className="text-3xl md:text-5xl font-light text-slate-300/90 mt-2 block tracking-normal">
                            Your AI Pair Programmer
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.35 }}
                        className="text-lg md:text-xl text-slate-300/80 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Review code, learn faster, and ship with confidence using our multi-agent AI platform built specifically for developers.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/chat')}
                            className="group relative px-8 py-4 rounded-full font-semibold text-white bg-blue-600 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_45px_-8px_rgba(59,130,246,0.8)] active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-100 group-hover:opacity-95 transition-opacity" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer transition-opacity" />
                            <div className="absolute -inset-x-6 -bottom-6 h-8 bg-blue-500/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center gap-2">
                                Start Coding Smarter
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/features')}
                            className="px-8 py-4 glass-button rounded-full font-semibold text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300/40 hover:shadow-[0_0_35px_-12px_rgba(129,140,248,0.7)] flex items-center gap-2 group"
                        >
                            Explore Features
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Quick Stats Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.65 }}
                        className="mt-20 flex flex-wrap justify-center gap-6"
                    >
                        {[
                            { text: "Free Tier Available", icon: CheckCircle2, color: "text-emerald-400" },
                            { text: "No Credit Card", icon: CheckCircle2, color: "text-emerald-400" },
                            { text: "Open Source", icon: Github, color: "text-slate-200" }
                        ].map((stat, i) => (
                            <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-slate-400">
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                <span>{stat.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="scroll-indicator">
                        <div className="scroll-indicator-track">
                            <span className="scroll-indicator-dot" />
                        </div>
                        <p className="scroll-indicator-text">SCROLL</p>
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="relative py-24 md:py-28 px-4 z-10">
                <div className="max-w-7xl mx-auto min-h-[70vh] flex items-center">
                    <div className="w-full grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="max-w-xl"
                        >
                            <p className="text-xs md:text-sm font-semibold tracking-[0.28em] text-blue-300/90 mb-5">
                                SEE IT IN ACTION
                            </p>
                            <h2 className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight text-white mb-6">
                                Code review in seconds, not hours
                            </h2>
                            <p className="text-base md:text-lg leading-relaxed text-slate-300/90 max-w-lg mb-10">
                                Just paste your code. CODESHERPA analyzes structure, logic, complexity, and security in one go - with actionable feedback.
                            </p>

                            <button
                                onClick={() => navigate('/chat')}
                                className="group relative inline-flex items-center justify-center px-8 py-3.5 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-6px_rgba(59,130,246,0.75)] active:scale-95"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_25%_10%,rgba(255,255,255,0.35),transparent_55%)]" />
                                <span className="relative z-10 flex items-center gap-2">
                                    Try Live Demo
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.75, delay: 0.1 }}
                            className="relative"
                        >
                            <div className="pointer-events-none absolute -top-10 -right-8 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full animate-float-orb" />
                            <div className="pointer-events-none absolute -bottom-8 -left-8 w-44 h-44 bg-blue-500/20 blur-3xl rounded-full animate-float-orb-delay" />

                            <div className="demo-code-card group rounded-3xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400/90" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-300/90" />
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/90" />
                                    </div>
                                    <div className="text-xs font-medium tracking-wide text-slate-300 flex items-center gap-2">
                                        review.py
                                        <span className="inline-block w-1.5 h-4 bg-blue-300/80 animate-code-cursor" />
                                    </div>
                                </div>

                                <div className="p-5 md:p-6 space-y-5 bg-gradient-to-b from-[#0f1125]/75 to-[#080913]/85">
                                    <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                                        <pre className="typing-code text-sm leading-6 overflow-x-auto">
                                            <code>
                                                <span className="text-purple-300">async def</span> <span className="text-blue-300">process_user_data</span><span className="text-slate-300">(</span><span className="text-orange-300">user_id</span><span className="text-slate-300">):</span>{"\n"}
                                                {"    "}query = <span className="text-emerald-300">f"SELECT * FROM users WHERE id=&#123;user_id&#125;"</span>{"\n"}
                                                {"    "}result = <span className="text-purple-300">await</span> <span className="text-blue-300">db.execute</span><span className="text-slate-300">(query)</span>{"\n"}
                                                {"    "}return result
                                            </code>
                                        </pre>
                                    </div>

                                    <div className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-4">
                                        <p className="text-sm font-semibold text-amber-200 mb-3">âš  CODESHERPA detected 2 issues:</p>
                                        <div className="space-y-2.5 text-sm leading-relaxed">
                                            <p className="text-slate-200">1. <span className="text-rose-300 font-medium">SQL Injection vulnerability (HIGH)</span></p>
                                            <p className="text-slate-300">Use parameterized queries instead</p>
                                            <p className="text-slate-200">2. <span className="text-amber-300 font-medium">No input validation (MEDIUM)</span></p>
                                            <p className="text-slate-300">Validate user_id type &amp; range</p>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-emerald-300/20 bg-emerald-500/10 p-4">
                                        <p className="text-xs tracking-wide uppercase font-semibold text-emerald-200 mb-2">Suggested fix</p>
                                        <pre className="text-sm leading-6 overflow-x-auto">
                                            <code>
                                                <span className="text-purple-300">async def</span> <span className="text-blue-300">process_user_data</span><span className="text-slate-300">(</span><span className="text-orange-300">user_id: int</span><span className="text-slate-300">):</span>{"\n"}
                                                {"    "}query = <span className="text-emerald-300">"SELECT * FROM users WHERE id=$1"</span>{"\n"}
                                                {"    "}return <span className="text-purple-300">await</span> <span className="text-blue-300">db.execute</span><span className="text-slate-300">(query, [user_id])</span>
                                            </code>
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Agent Logos Loop - Premium Panel */}
            <section className="relative py-14 overflow-hidden border-y border-white/[0.05] bg-white/[0.01]">
                <div className="absolute inset-0 bg-grid-white opacity-[0.02] pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] mb-2">
                        Powered by Specialized Multi-Agent Systems
                    </p>
                </div>
                <LogoLoop
                    logos={[
                        { node: <Brain className="w-10 h-10 text-blue-400" />, title: "Orchestrator" },
                        { node: <Code2 className="w-10 h-10 text-purple-400" />, title: "Coder" },
                        { node: <Shield className="w-10 h-10 text-emerald-400" />, title: "Security" },
                        { node: <Bug className="w-10 h-10 text-rose-400" />, title: "Debugger" },
                        { node: <Database className="w-10 h-10 text-amber-400" />, title: "SQL Expert" },
                        { node: <Cloud className="w-10 h-10 text-cyan-400" />, title: "DevOps" },
                        { node: <Bot className="w-10 h-10 text-pink-400" />, title: "QA Bot" },
                        { node: <Terminal className="w-10 h-10 text-orange-400" />, title: "Terminal" },
                        { node: <Zap className="w-10 h-10 text-yellow-400" />, title: "Performance" },
                        { node: <Globe className="w-10 h-10 text-indigo-400" />, title: "Localization" },
                    ]}
                    speed={60}
                    direction="left"
                    logoHeight={50}
                    gap={80}
                    pauseOnHover={true}
                    scaleOnHover={true}
                    className="py-4 opacity-80 hover:opacity-100 transition-opacity"
                />
            </section>

            {/* Stats Section with Glass Cards */}
            <section className="relative py-24 px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="glass-card glass-hover-card p-6 rounded-2xl text-center group">
                                <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <StatsCounter {...stat} delay={index * 0.1} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Specialized Agents Showcase */}
            <AgentsShowcase />

            {/* Features Section */}
            <section className="relative py-32 px-4 z-10">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_50%_-60px,rgba(88,28,235,0.28),transparent_70%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_420px_320px_at_95%_40%,rgba(59,130,246,0.07),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_420px_320px_at_0%_80%,rgba(139,92,246,0.07),transparent_60%)]" />
                </div>
                <div className="max-w-[1280px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative text-center mb-20"
                    >
                        <p className="inline-flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase font-semibold text-blue-300 mb-4">
                            <span className="w-7 h-px bg-blue-300/80" />
                            How It Works
                            <span className="w-7 h-px bg-blue-300/80" />
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-purple-200">
                            AI Agents Workflow
                        </h2>
                        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                            Paste your code once. Watch five specialized agents work in perfect harmony.
                        </p>
                    </motion.div>

                    <div className="relative">
                        <div className="hidden xl:block absolute left-[7.4rem] right-[7.4rem] top-10 h-[2px] z-0 bg-gradient-to-r from-blue-400/10 via-blue-400/50 via-purple-400/60 via-orange-400/60 via-green-400/60 to-cyan-400/10">
                            <motion.div
                                className="absolute top-1/2 -translate-y-1/2 h-1.5 w-16 rounded-full bg-gradient-to-r from-transparent via-white to-transparent blur-[1px]"
                                animate={{ x: ["-4rem", "calc(100% + 4rem)"] }}
                                transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                            {workflowSteps.map((step, index) => (
                                <motion.div
                                    key={step.num}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.12 }}
                                    className="relative flex flex-col items-center px-1"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.08 }}
                                        className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.nodeBg} grid place-items-center text-3xl mb-7 shadow-[0_0_30px_rgba(59,130,246,0.25)]`}
                                    >
                                        <motion.span
                                            className="absolute -inset-2 rounded-full border border-white/20"
                                            animate={{ scale: [0.9, 1.45], opacity: [0.6, 0] }}
                                            transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.5 }}
                                        />
                                        <span className="relative z-10">{step.icon}</span>
                                    </motion.div>

                                    {index < workflowSteps.length - 1 && (
                                        <div className="hidden xl:flex absolute top-8 -right-4 text-slate-500">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}

                                    <div
                                        className={`workflow-glass-card w-full h-full min-h-[320px] rounded-2xl border bg-slate-900/70 backdrop-blur-md p-5 text-center flex flex-col relative overflow-hidden ${step.cardBorder} ${step.cardGlow}`}
                                        onMouseMove={(e) => handleWorkflowMove(e, step.glowColor)}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
                                            e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.4s ease'
                                            e.currentTarget.style.boxShadow = ''
                                            const orb = e.currentTarget.querySelector('.workflow-glow-orb')
                                            if (orb) {
                                                orb.style.left = '50%'
                                                orb.style.top = '50%'
                                            }
                                        }}
                                    >
                                        <div className="workflow-glow-orb" />
                                        <div className="workflow-particles">
                                            {workflowParticleDelays.map((delay, i) => (
                                                <span
                                                    key={i}
                                                    className="workflow-particle"
                                                    style={{
                                                        left: `${12 + i * 10}%`,
                                                        animationDelay: `${delay}s`
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <div className="workflow-card-inner relative z-10 flex flex-col h-full">
                                        <p className={`text-[11px] uppercase tracking-[0.14em] font-bold mb-1 ${step.labelColor}`}>
                                            {step.label}
                                        </p>
                                        <h3 className="text-lg font-extrabold text-slate-100 mb-2">{step.title}</h3>
                                        <p className="text-[13px] leading-6 text-slate-500 mb-4">{step.desc}</p>

                                        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
                                            {step.tags.map((tag) => (
                                                <span key={tag} className={`px-2.5 py-1 rounded-full border text-[10px] font-semibold tracking-wide uppercase ${step.tagClass}`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="pt-3 border-t border-white/10 mt-auto">
                                            <p className={`text-2xl font-black ${step.labelColor}`}>{step.stat}</p>
                                            <p className="text-[11px] tracking-wide uppercase text-slate-600">{step.statLabel}</p>
                                        </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-md px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-6">
                            <div className="flex flex-wrap gap-8">
                                {[
                                    { n: "~40s", l: "Full Pipeline" },
                                    { n: "5", l: "AI Agents" },
                                    { n: "50K+", l: "PRs Reviewed" },
                                    { n: "â‚¹2Cr+", l: "Dev Time Saved" }
                                ].map((item) => (
                                    <div key={item.l} className="text-center">
                                        <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-200">{item.n}</p>
                                        <p className="text-[11px] tracking-[0.12em] uppercase text-slate-600">{item.l}</p>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/chat')}
                                className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold shadow-[0_0_30px_rgba(59,130,246,0.35)] hover:-translate-y-0.5 transition-all"
                            >
                                Try Live Demo â†’
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section - Refined Glass Cards */}
            <section className="relative py-32 px-4 z-10 bg-gradient-to-b from-transparent to-black/20">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-24"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                            From repo to insights in three specialized steps.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent -translate-y-1/2 z-0" />

                        {[
                            {
                                step: "01",
                                title: "Connect",
                                description: "Link your GitHub repository or paste code directly into our secure sandbox.",
                                icon: <Github className="w-8 h-8" />
                            },
                            {
                                step: "02",
                                title: "Analyze",
                                description: "Our multi-agent system reviews heavily for bugs, security risks, and patterns.",
                                icon: <Brain className="w-8 h-8" />
                            },
                            {
                                step: "03",
                                title: "Optimize",
                                description: "Receive detailed, actionable feedback in your preferred language.",
                                icon: <Rocket className="w-8 h-8" />
                            }
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                className="relative z-10 group"
                            >
                                <div className="glass-card glass-hover-card rounded-3xl p-10 h-full hover:-translate-y-2 transition-transform duration-500 bg-[#0A0A0B]">
                                    <div className="text-7xl font-black text-white/5 mb-6 absolute top-4 right-6 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                                        {item.step}
                                    </div>
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 mb-8 group-hover:bg-blue-500/10 group-hover:text-blue-300 transition-colors">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{item.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="relative py-32 px-4 z-10">
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_820px_460px_at_50%_-80px,rgba(88,28,235,0.18),transparent_72%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_420px_320px_at_95%_40%,rgba(29,78,216,0.08),transparent_62%)]" />
                </div>
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
                            Loved by Developers
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                            See what the community is deploying with CodeSherpa.
                        </p>
                    </motion.div>

                    <div className="columns-1 md:columns-2 xl:columns-3 gap-4 [column-fill:_balance]">
                        {tweetWall.map((tweet, index) => (
                            <motion.article
                                key={tweet.handle}
                                initial={{ opacity: 0, y: 22 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                className={`mb-4 rounded-2xl border border-white/10 bg-black/50 backdrop-blur-xl p-5 transition-all duration-300 hover:-translate-y-0.5 ${tweet.glow} [break-inside:avoid]`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${tweet.avatarClass} grid place-items-center text-xs font-extrabold`}>
                                            {tweet.avatar}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                                                {tweet.name}
                                                {tweet.verified && (
                                                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-500">
                                                        <BadgeCheck className="w-3 h-3 text-white" />
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-xs text-slate-500">{tweet.handle}</p>
                                        </div>
                                    </div>
                                    <span className="text-slate-600 text-sm font-semibold">X</span>
                                </div>

                                {tweet.chips?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tweet.chips.map((chip) => (
                                            <span key={chip} className="px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-white/5 border border-white/10 text-slate-400">
                                                {chip}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <p className="text-[0.92rem] leading-7 text-slate-200 mb-3">{tweet.body}</p>

                                {tweet.code && (
                                    <pre className="mb-3 rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-cyan-200 leading-6 overflow-x-auto font-mono">
                                        {tweet.code.map((line) => <div key={line}>{line}</div>)}
                                    </pre>
                                )}

                                {tweet.tag && (
                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border mb-3 ${tweet.tagClass}`}>
                                        {tweet.tag}
                                    </span>
                                )}

                                <div className="pt-3 border-t border-white/10 flex items-center gap-4 text-slate-500 text-xs">
                                    <span className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"><MessageCircle className="w-3.5 h-3.5" />{tweet.comments}</span>
                                    <span className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"><Repeat2 className="w-3.5 h-3.5" />{tweet.reposts}</span>
                                    <span className="inline-flex items-center gap-1.5 hover:text-slate-200 transition-colors"><Heart className="w-3.5 h-3.5" />{tweet.likes}</span>
                                    <span className="ml-auto text-[10px] tracking-wide text-slate-600">{tweet.time}</span>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {communityStats.map((item) => (
                            <HoverStat
                                key={item.label}
                                label={item.label}
                                baseValue={item.baseValue}
                                hoverValue={item.hoverValue}
                                formatValue={item.formatValue}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Premium Gradient */}
            <section className="relative py-32 px-4 z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-panel rounded-[2.5rem] p-12 md:p-24 relative overflow-hidden"
                    >
                        {/* Dramatic Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-blue-900/40 opacity-50" />
                        <div className="absolute inset-0 bg-grid-white opacity-[0.05]" />

                        <div className="relative z-10">
                            <span className="pointer-events-none absolute top-4 left-4 w-10 h-10 border-t border-l border-white/20 rounded-tl-md" />
                            <span className="pointer-events-none absolute top-4 right-4 w-10 h-10 border-t border-r border-white/20 rounded-tr-md" />
                            <span className="pointer-events-none absolute bottom-4 left-4 w-10 h-10 border-b border-l border-white/20 rounded-bl-md" />
                            <span className="pointer-events-none absolute bottom-4 right-4 w-10 h-10 border-b border-r border-white/20 rounded-br-md" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 mb-8"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
                                <span className="text-[11px] tracking-[0.1em] uppercase text-slate-300 font-medium">
                                    system.status - all engines running
                                </span>
                            </motion.div>

                            <h2 className="text-5xl md:text-7xl font-black mb-7 text-white tracking-tight leading-[1.05]">
                                Ready to Code<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200">
                                    Smarter?
                                </span>
                            </h2>
                            <p className="text-base md:text-lg text-slate-300/85 mb-11 max-w-xl mx-auto font-light leading-relaxed">
                                Join thousands of developers using CodeSherpa to ship better code, faster.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <button
                                    onClick={() => navigate('/chat')}
                                    className="group relative px-8 py-4 rounded-xl font-bold text-base text-white bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.35)]"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Get Started Free
                                        <span className="w-6 h-6 rounded-full bg-white/20 grid place-items-center text-sm group-hover:translate-x-0.5 transition-transform">â†’</span>
                                    </span>
                                </button>

                                <button
                                    onClick={() => navigate('/features')}
                                    className="px-7 py-4 rounded-xl font-medium text-sm tracking-wide text-slate-300 border border-white/15 bg-transparent hover:bg-white/5 hover:text-white transition-all"
                                >
                                    â–¶ Watch Demo
                                </button>
                            </div>

                            <div className="mt-9 flex flex-wrap items-center justify-center gap-3 text-[11px] tracking-[0.08em] uppercase text-slate-500">
                                <span>No credit card required</span>
                                <span className="w-px h-3 bg-white/10" />
                                <span>Free forever plan</span>
                                <span className="w-px h-3 bg-white/10" />
                                <span>Cancel anytime</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default HomePage

