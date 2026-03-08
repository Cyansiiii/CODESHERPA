import React from 'react'
import { motion } from 'framer-motion'

const FeatureCard = ({ icon, title, description, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            whileHover={{ y: -5 }}
            className="group relative"
        >
            <div className="glass-hover-card rounded-3xl p-8 h-full">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${color} mb-6 group-hover:scale-110 transition-transform`}>
                    {icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <p className="text-gray-400">{description}</p>
            </div>
        </motion.div>
    )
}

export default FeatureCard
