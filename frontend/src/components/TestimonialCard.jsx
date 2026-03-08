import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const TestimonialCard = ({ name, role, content, avatar, rating, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="glass-hover-card rounded-3xl p-8"
        >
            <div className="flex gap-1 mb-4">
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
            </div>
            <p className="text-gray-300 mb-6 italic">"{content}"</p>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold">
                    {avatar}
                </div>
                <div>
                    <div className="font-bold">{name}</div>
                    <div className="text-sm text-gray-400">{role}</div>
                </div>
            </div>
        </motion.div>
    )
}

export default TestimonialCard
