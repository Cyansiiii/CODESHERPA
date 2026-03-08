import React, { useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const StatsCounter = ({ value, suffix, label, icon, delay = 0 }) => {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    useEffect(() => {
        if (isInView) {
            let start = 0
            const end = value
            const duration = 2000
            const increment = end / (duration / 16)

            const timer = setInterval(() => {
                start += increment
                if (start >= end) {
                    setCount(end)
                    clearInterval(timer)
                } else {
                    setCount(Math.floor(start))
                }
            }, 16)

            return () => clearInterval(timer)
        }
    }, [isInView, value])

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="glass-hover-card rounded-3xl p-8 text-center"
        >
            <div className="text-blue-400 mb-4 flex justify-center">
                {React.cloneElement(icon, { className: 'w-8 h-8' })}
            </div>
            <div className="text-4xl md:text-5xl font-black mb-2">
                {count.toLocaleString()}{suffix}
            </div>
            <div className="text-gray-400 text-sm">{label}</div>
        </motion.div>
    )
}

export default StatsCounter
