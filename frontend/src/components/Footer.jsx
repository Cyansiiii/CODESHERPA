import React from 'react'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Heart, MessageCircle } from 'lucide-react'
import Logo from '../assets/images/logo.svg'
import TextRoll from './TextRoll'

const Footer = () => {
    const productLinks = ['Features', 'Pricing', 'Documentation', 'API']
    const companyLinks = ['About', 'Blog', 'Careers', 'Contact']

    return (
        <footer className="relative overflow-hidden px-4 pt-16 pb-6 border-t border-white/10 bg-[#030712]">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-indigo-400/80 via-purple-400/70 to-transparent" />
                <div className="absolute -top-20 left-[14%] h-56 w-56 rounded-full bg-blue-500/12 blur-3xl" />
                <div className="absolute top-10 right-[12%] h-64 w-64 rounded-full bg-purple-500/14 blur-3xl" />
                <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(99,102,241,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a1025]/45 via-[#070b1b]/70 to-[#030712]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-[1.6fr_1fr_1fr] gap-10 pb-14">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-3 mb-5">
                            <motion.div
                                whileHover={{ scale: 1.08, rotate: -3 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                                className="w-10 h-10 flex items-center justify-center"
                            >
                                <img src={Logo} alt="CodeSherpa Logo" className="w-8 h-8" />
                            </motion.div>
                            <TextRoll className="text-base font-black tracking-[0.12em] inline-block" textClassName="gradient-text-white">
                                CODESHERPA
                            </TextRoll>
                        </div>

                        <p className="font-mono text-[12px] leading-7 text-slate-500 max-w-[320px] mb-7">
                            Your <span className="text-slate-400">AI pair programmer</span> built for Indian developers.
                            Code smarter, ship faster, learn better.
                        </p>

                        <div className="flex w-full max-w-[320px] mb-7">
                            <input
                                type="text"
                                placeholder="your@email.com"
                                className="flex-1 bg-white/5 border border-blue-400/25 border-r-0 rounded-l-lg px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 font-mono outline-none focus:border-indigo-400/50"
                            />
                            <button className="px-4 py-2.5 rounded-r-lg text-xs font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:opacity-90 transition-opacity">
                                Subscribe
                            </button>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <a
                                href="https://github.com/Cyansiiii/AI-FOR-BHARAT"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg border border-indigo-400/30 bg-white/5 text-slate-400 grid place-items-center hover:-translate-y-0.5 hover:text-indigo-200 hover:bg-indigo-500/15 transition-all"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg border border-indigo-400/30 bg-white/5 text-slate-400 grid place-items-center hover:-translate-y-0.5 hover:text-indigo-200 hover:bg-indigo-500/15 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg border border-indigo-400/30 bg-white/5 text-slate-400 grid place-items-center hover:-translate-y-0.5 hover:text-indigo-200 hover:bg-indigo-500/15 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-lg border border-indigo-400/30 bg-white/5 text-slate-400 grid place-items-center hover:-translate-y-0.5 hover:text-indigo-200 hover:bg-indigo-500/15 transition-all">
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <p className="text-[10px] tracking-[0.18em] uppercase text-indigo-300 font-mono mb-5 flex items-center gap-2">
                            Product
                            <span className="flex-1 h-px bg-gradient-to-r from-indigo-400/40 to-transparent" />
                        </p>
                        <ul className="space-y-1">
                            {productLinks.map((link) => (
                                <li key={link}>
                                    <a href="#" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-500 hover:text-slate-100 hover:bg-indigo-500/12 transition-all">
                                        <span className="w-1 h-1 rounded-full bg-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link}
                                        {link === 'API' && (
                                            <span className="ml-auto px-2 py-0.5 rounded-full border border-cyan-400/30 bg-cyan-500/15 text-[9px] text-cyan-300 font-mono uppercase">
                                                New
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <p className="text-[10px] tracking-[0.18em] uppercase text-indigo-300 font-mono mb-5 flex items-center gap-2">
                            Company
                            <span className="flex-1 h-px bg-gradient-to-r from-indigo-400/40 to-transparent" />
                        </p>
                        <ul className="space-y-1">
                            {companyLinks.map((link) => (
                                <li key={link}>
                                    <a href="#" className="group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-slate-500 hover:text-slate-100 hover:bg-indigo-500/12 transition-all">
                                        <span className="w-1 h-1 rounded-full bg-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link}
                                        {link === 'Careers' && (
                                            <span className="ml-auto px-2 py-0.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 text-[9px] text-indigo-300 font-mono uppercase">
                                                Hiring
                                            </span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-indigo-400/40 via-purple-400/35 to-transparent" />

                <div className="pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
                    <p className="font-mono text-[11px] tracking-wide text-slate-600">
                        © 2026 <span className="text-slate-500">CodeSherpa.</span> All rights reserved.
                    </p>
                    <div className="flex items-center gap-5 font-mono text-[11px] tracking-wide flex-wrap justify-center">
                        <a href="#" className="text-slate-600 hover:text-indigo-300 transition-colors">Terms</a>
                        <a href="#" className="text-slate-600 hover:text-indigo-300 transition-colors">Privacy</a>
                        <a href="#" className="text-slate-600 hover:text-indigo-300 transition-colors">Cookies</a>
                    </div>
                    <p className="font-mono text-[11px] tracking-wide text-slate-600 flex items-center gap-1.5">
                        Made with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500 animate-pulse-slow" />
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-400/25 text-indigo-300">India</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer


