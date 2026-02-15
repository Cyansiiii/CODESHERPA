import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ReactLenis from 'lenis/react'
import 'lenis/dist/lenis.css'
import HomePage from './pages/HomePage'
import ChatPage from './pages/ChatPage'
import FeaturesPage from './pages/FeaturesPage'
import './App.css'
import DarkVeil from './components/DarkVeil'

function App() {
    return (
        <ReactLenis root options={{ autoRaf: true }}>
            <Router>
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
                    <DarkVeil
                        hueShift={0}
                        noiseIntensity={0}
                        scanlineIntensity={0}
                        speed={1.1}
                        scanlineFrequency={0}
                        warpAmount={0}
                    />
                </div>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                </Routes>
            </Router>
        </ReactLenis>
    )
}

export default App
