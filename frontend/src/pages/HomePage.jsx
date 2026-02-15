import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
    Sparkles, ArrowRight, Code2, Brain, Zap, Shield,
    Globe, MessageSquare, Github, CheckCircle2, Star,
    TrendingUp, Users, Award, Rocket, Bug, Database, Cloud, Bot, Terminal
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TextRoll from '../components/TextRoll'
import HoverExpandGallery from '../components/HoverExpandGallery'
import LogoLoop from '../components/LogoLoop'
import ScrollAnimationShowcase from '../components/ScrollAnimationShowcase'
import StatsCounter from '../components/StatsCounter'
import TestimonialCard from '../components/TestimonialCard'
import DarkVeil from '../components/DarkVeil'
import MultiAgentIcon from '../assets/images/multi-agent-architecture.svg'
import SmartCodeReviewIcon from '../assets/images/smart-code-review.svg'
import MultilingualIcon from '../assets/images/multilingual-support.svg'
import RealTimeChatIcon from '../assets/images/real-time-chat.svg'
import WhatsAppIcon from '../assets/images/whatsapp-integration.svg'

// ... existing imports

const HomePage = () => {
    const navigate = useNavigate()
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    const features = [
        {
            icon: <img src={MultiAgentIcon} className="w-8 h-8" alt="Multi-Agent AI System" />,
            title: "Multi-Agent AI System",
            description: "Specialized AI agents for code review, learning, and documentation",
            color: "from-blue-500/80 to-cyan-500/80"
        },
        {
            icon: <img src={SmartCodeReviewIcon} className="w-8 h-8" alt="Smart Code Review" />,
            title: "Smart Code Review",
            description: "Automated PR reviews with security checks and best practices",
            color: "from-purple-500/80 to-pink-500/80"
        },
        {
            icon: <img src={MultilingualIcon} className="w-8 h-8" alt="Multilingual Support" />,
            title: "Multilingual Support",
            description: "Explain code in Hindi, English, or Hinglish for Indian developers",
            color: "from-orange-500/80 to-red-500/80"
        },
        {
            icon: <img src={RealTimeChatIcon} className="w-8 h-8" alt="Real-Time Chat" />,
            title: "Real-Time Chat",
            description: "Instant responses via WebSocket for seamless interaction",
            color: "from-yellow-500/80 to-orange-500/80"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Security First",
            description: "OWASP Top 10 vulnerability detection and AWS optimization",
            color: "from-green-500/80 to-emerald-500/80"
        },
        {
            icon: <img src={WhatsAppIcon} className="w-8 h-8" alt="WhatsApp Integration" />,
            title: "WhatsApp Integration",
            description: "Code on the go with mobile-first WhatsApp support",
            color: "from-teal-500/80 to-cyan-500/80"
        }
    ]

    const stats = [
        { value: 10000, suffix: "+", label: "Lines of Code Reviewed", icon: <Code2 className="text-blue-400" /> },
        { value: 500, suffix: "+", label: "Bugs Prevented", icon: <Shield className="text-green-400" /> },
        { value: 1000, suffix: "+", label: "Developers Helped", icon: <Users className="text-purple-400" /> },
        { value: 99, suffix: "%", label: "Satisfaction Rate", icon: <Award className="text-yellow-400" /> }
    ]

    const testimonials = [
        {
            name: "Rahul Sharma",
            role: "Senior Developer at TCS",
            content: "CodeSherpa has transformed how we review code. The Hindi explanations help our junior developers learn faster!",
            avatar: "RS",
            rating: 5
        },
        {
            name: "Priya Patel",
            role: "Tech Lead at Infosys",
            content: "The multi-agent system is brilliant. It catches security issues we would have missed. A must-have tool!",
            avatar: "PP",
            rating: 5
        },
        {
            name: "Amit Kumar",
            role: "Freelance Developer",
            content: "WhatsApp integration is a game-changer. I can review code while commuting. Truly built for India!",
            avatar: "AK",
            rating: 5
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
                <div className="relative z-10 max-w-7xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 glass-panel rounded-full mb-8"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span className="text-xs font-medium tracking-wide text-slate-300 uppercase">
                            Powered by AWS Bedrock & Claude 3.5 Sonnet
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-6xl md:text-9xl font-black mb-6 leading-[0.9] tracking-tight text-white relative z-20"
                    >
                        <div className="relative inline-block">
                            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 pb-2 font-black text-6xl md:text-9xl tracking-tight leading-[0.9]">
                                CODESHERPA
                            </span>
                        </div>
                        <br />
                        <span className="text-3xl md:text-5xl font-light text-slate-400 mt-2 block tracking-normal">
                            Your AI Pair Programmer
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Review code, learn faster, and ship with confidence using our multi-agent AI platform built specifically for Indian developers. <span className="inline-block hover:scale-125 transition-transform duration-300 ease-out cursor-default">🇮🇳</span>
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/chat')}
                            className="group relative px-8 py-4 rounded-full font-semibold text-white bg-blue-600 overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] active:scale-95"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 opacity-100 group-hover:opacity-90 transition-opacity" />
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] animate-shimmer transition-opacity" />

                            <span className="relative z-10 flex items-center gap-2">
                                Start Coding Smarter
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button
                            onClick={() => navigate('/features')}
                            className="px-8 py-4 glass-button rounded-full font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            Explore Features
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                        </button>
                    </motion.div>

                    {/* Quick Stats Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
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
                            <div key={index} className="glass-card p-6 rounded-2xl text-center group">
                                <div className="mb-4 inline-flex p-3 rounded-lg bg-white/5 group-hover:scale-110 transition-transform duration-300">
                                    {stat.icon}
                                </div>
                                <StatsCounter {...stat} delay={index * 0.1} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scroll Animation Showcase - No change needed, fits well */}
            <ScrollAnimationShowcase />

            {/* Features Section */}
            <section className="relative py-32 px-4 z-10">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                            Expertly crafted tools to help you build, debug, and deploy faster.
                        </p>
                    </motion.div>

                    <div className="w-full">
                        <HoverExpandGallery items={features} />
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
                                <div className="glass-card rounded-3xl p-10 h-full hover:-translate-y-2 transition-transform duration-500 bg-[#0A0A0B]">
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

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard key={index} {...testimonial} delay={index * 0.1} />
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
                            <h2 className="text-5xl md:text-7xl font-black mb-8 text-white tracking-tight">
                                Ready to Code Smarter?
                            </h2>
                            <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-light">
                                Join thousands of developers using CodeSherpa to ship better code, faster.
                            </p>
                            <button
                                onClick={() => navigate('/chat')}
                                className="group relative px-10 py-5 rounded-full font-bold text-lg text-white bg-white/10 border border-white/20 backdrop-blur-md overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:shadow-[0_0_50px_-10px_rgba(255,255,255,0.3)]"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    Get Started Free
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default HomePage
