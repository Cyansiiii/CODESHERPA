import React from 'react'
import { motion } from 'framer-motion'
import pricingData from '../data/bedrockPricing.json'

const BedrockPricingShowcase = () => {
    const pricingRows = pricingData.rows || []

    return (
        <section className="relative z-10 px-4 py-16">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="mb-8"
                >
                    <div className="inline-flex rounded-full border border-cyan-300/30 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-cyan-200">
                        Bedrock Cost Snapshot
                    </div>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
                        Model Pricing Transparency
                    </h2>
                    <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                        Quick pricing reference for AWS Bedrock Anthropic models used in CodeSherpa workflows.
                        Values are loaded from JSON snapshot ({pricingData.currency}, {pricingData.unit}).
                    </p>
                    <p className="mt-2 text-xs text-slate-400">Last updated: {pricingData.updatedAt}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-hover-card overflow-hidden rounded-3xl border border-white/10 bg-slate-950/45 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                >
                    <div className="hidden overflow-x-auto md:block">
                        <table className="w-full min-w-[780px] text-left">
                            <thead className="bg-white/5 text-xs uppercase tracking-wide text-slate-300">
                                <tr>
                                    <th className="px-6 py-4">Model</th>
                                    <th className="px-6 py-4">Input / 1M</th>
                                    <th className="px-6 py-4">Output / 1M</th>
                                    <th className="px-6 py-4">Batch Input / 1M</th>
                                    <th className="px-6 py-4">Cache Read / 1M</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pricingRows.map((row) => (
                                    <tr key={row.model} className="border-t border-white/5 text-sm text-slate-100">
                                        <td className="px-6 py-4 font-medium">{row.model}</td>
                                        <td className="px-6 py-4 text-cyan-200">{row.input}</td>
                                        <td className="px-6 py-4">{row.output}</td>
                                        <td className="px-6 py-4">{row.batchInput}</td>
                                        <td className="px-6 py-4">{row.cacheRead}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="space-y-3 p-4 md:hidden">
                        {pricingRows.map((row) => (
                            <div key={row.model} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                                <h3 className="text-sm font-semibold text-white">{row.model}</h3>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
                                    <p>Input: <span className="text-cyan-200">{row.input}</span></p>
                                    <p>Output: <span>{row.output}</span></p>
                                    <p>Batch: <span>{row.batchInput}</span></p>
                                    <p>Cache: <span>{row.cacheRead}</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

export default BedrockPricingShowcase
