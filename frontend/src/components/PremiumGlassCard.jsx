import React from 'react'
import { motion } from 'framer-motion'

const sweepTransition = {
    duration: 0.85,
    ease: [0.45, 0, 0.2, 1]
}

const PremiumGlassCard = ({ icon, title, description, details = [], color = 'from-blue-500 to-cyan-500' }) => {
    return (
        <motion.article
            initial="rest"
            whileHover="hover"
            style={{ WebkitBackdropFilter: 'blur(20px)' }}
            className="group relative h-full overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] p-8 backdrop-blur-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-700 ease-in-out hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.10)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
        >
            <motion.div
                variants={{
                    rest: { y: 0 },
                    hover: { y: -4 }
                }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
                className="relative z-10"
            >
                <div className={`mb-6 inline-flex rounded-2xl bg-gradient-to-r p-4 ${color}`}>
                    {icon}
                </div>

                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-white">{title}</h3>
                <p className="mb-6 text-sm leading-relaxed text-slate-300">{description}</p>

                <ul className="space-y-2">
                    {details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                            <span className="mt-1 text-cyan-300">•</span>
                            <span>{detail}</span>
                        </li>
                    ))}
                </ul>
            </motion.div>

            <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 rounded-[40px] bg-gradient-to-r from-white/0 via-white/22 to-white/0 opacity-0 backdrop-blur-xl"
                variants={{
                    rest: { x: '-120%', opacity: 0 },
                    hover: { x: '340%', opacity: 0.55 }
                }}
                transition={sweepTransition}
            />

            <motion.div
                aria-hidden
                className="pointer-events-none absolute -left-1/3 top-[-18%] h-[140%] w-16 rotate-12 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 blur-sm"
                variants={{
                    rest: { x: '-100%', opacity: 0 },
                    hover: { x: '470%', opacity: 0.45 }
                }}
                transition={sweepTransition}
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent opacity-40" />
        </motion.article>
    )
}

export default PremiumGlassCard
