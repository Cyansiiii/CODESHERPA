import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send,
    Loader2,
    Copy,
    Check,
    Home,
    Menu,
    X,
    Search,
    Bell,
    LayoutDashboard,
    Bot,
    FolderKanban,
    Settings,
    MessageSquare,
    Activity,
    ShieldAlert,
    Clock3,
    Cpu,
    GitBranch,
    PlayCircle,
    CheckCircle2,
    SlidersHorizontal,
    Globe2,
    Sparkles,
    Paperclip,
    FileText
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import Logo from '../assets/images/logo.svg'

const ChatPage = () => {
    const navigate = useNavigate()
    const [selectedSection, setSelectedSection] = useState('Chat')
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'agent',
            text: "Hello! I am CodeSherpa, your AI pair programmer. How can I help today?\n\nTry:\n- **Namaste demo** for Hindi explanation\n- **Review demo** for code review example\n- Or ask anything about your code",
            timestamp: new Date().toLocaleTimeString()
        }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [copiedId, setCopiedId] = useState(null)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    const [attachedFile, setAttachedFile] = useState(null)
    const [fileError, setFileError] = useState('')
    const [language, setLanguage] = useState('English')
    const [models, setModels] = useState({ active: 'mock', available: {} })
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [autoReviewEnabled, setAutoReviewEnabled] = useState(true)
    const [apiKeyInput, setApiKeyInput] = useState('')

    useEffect(() => {
        fetch('http://localhost:8000/api/models')
            .then(res => res.json())
            .then(data => setModels(data))
            .catch(err => console.error(err))
    }, [])

    const ws = useRef(null)
    const messagesEndRef = useRef(null)
    const fileInputRef = useRef(null)
    const websocketUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws'
    const panelContainerVariants = {
        hidden: { opacity: 0, y: 8 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.06
            }
        }
    }
    const panelItemVariants = {
        hidden: { opacity: 0, y: 16, scale: 0.985 },
        show: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 240,
                damping: 22
            }
        }
    }
    const panelCardHover = {
        y: -3,
        scale: 1.006,
        borderColor: 'rgba(56,189,248,0.28)',
        backgroundColor: 'rgba(15,23,42,0.74)',
        boxShadow: '0 14px 28px rgba(2,132,199,0.16)',
        transition: { type: 'spring', stiffness: 260, damping: 20 }
    }
    const actionButtonHover = {
        y: -2,
        scale: 1.015,
        boxShadow: '0 8px 20px rgba(6,182,212,0.24)',
        transition: { type: 'spring', stiffness: 300, damping: 18 }
    }
    const secondaryButtonHover = {
        y: -1,
        scale: 1.01,
        borderColor: 'rgba(148,163,184,0.35)',
        backgroundColor: 'rgba(148,163,184,0.08)',
        transition: { type: 'spring', stiffness: 280, damping: 19 }
    }
    const iconButtonHover = {
        y: -1,
        scale: 1.04,
        backgroundColor: 'rgba(148,163,184,0.16)',
        transition: { type: 'spring', stiffness: 320, damping: 20 }
    }

    const navItems = [
        { label: 'Back Home', icon: Home, onClick: () => navigate('/') },
        { label: 'Dashboard', icon: LayoutDashboard },
        { label: 'Agents', icon: Bot },
        { label: 'Chat', icon: MessageSquare },
        { label: 'Projects', icon: FolderKanban },
        { label: 'Settings', icon: Settings }
    ]

    const handleNavClick = (item, mobile = false) => {
        if (item.onClick) {
            item.onClick()
        } else {
            setSelectedSection(item.label)
        }

        if (mobile) setIsMobileSidebarOpen(false)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        ws.current = new WebSocket(websocketUrl)

        ws.current.onopen = () => {
            console.log('Connected to CodeSherpa Backend')
            setIsConnected(true)
        }

        ws.current.onclose = () => {
            console.log('Disconnected')
            setIsConnected(false)
        }

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data)

            if (data.type === 'status' && data.content === 'thinking') {
                setIsTyping(true)
            } else if (data.type === 'response') {
                setIsTyping(false)
                const agentResponse = data.content

                let textContent = ''

                if (typeof agentResponse === 'object') {
                    if (agentResponse.error) {
                        textContent = `Error: ${agentResponse.error}`
                    } else if (agentResponse.reply) {
                        textContent = agentResponse.reply
                    } else if (agentResponse.summary) {
                        textContent = `## Code Review Results\n\n**Summary:** ${agentResponse.summary}\n\n**Quality Score:** ${agentResponse.quality_score}/10\n\n**Security Risk:** ${agentResponse.security_risk}\n\n### Findings:\n${agentResponse.findings.map((f, i) => `\n${i + 1}. **[${f.severity}]** ${f.file}:${f.line}\n   - **Issue:** ${f.issue}\n   - **Suggestion:** ${f.suggestion}\n   - **Fix:** \`${f.code_fix}\``).join('\n')}`
                    } else if (agentResponse.explanation) {
                        textContent = `## Code Explanation\n\n${agentResponse.explanation}\n\n### Key Concepts:\n${agentResponse.key_concepts.map(k => `- **${k.term}:** ${k.definition}`).join('\n')}\n\n### Analogy:\n> ${agentResponse.analogy}\n\n### Learning Steps:\n${agentResponse.learning_steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
                    } else {
                        textContent = `\`\`\`json\n${JSON.stringify(agentResponse, null, 2)}\n\`\`\``
                    }
                } else {
                    textContent = agentResponse
                }

                const newMessage = {
                    id: Date.now(),
                    sender: 'agent',
                    text: textContent,
                    timestamp: new Date().toLocaleTimeString()
                }
                setMessages(prev => [...prev, newMessage])
            }
        }

        return () => {
            if (ws.current) ws.current.close()
        }
    }, [websocketUrl])

    const sendMessage = () => {
        const trimmedMessage = input.trim()
        if ((!trimmedMessage && !attachedFile) || !isConnected) return

        const fallbackMessage = attachedFile
            ? `Please review the attached file: ${attachedFile.name}`
            : ''
        const outgoingMessage = trimmedMessage || fallbackMessage
        const userBubbleText = attachedFile
            ? `${trimmedMessage || 'Attached a file for review'}\n\n📎 ${attachedFile.name}`
            : outgoingMessage

        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: userBubbleText,
            timestamp: new Date().toLocaleTimeString()
        }
        setMessages(prev => [...prev, userMsg])

        if (ws.current && isConnected) {
            ws.current.send(JSON.stringify({
                message: outgoingMessage,
                session_id: 'demo-session-1',
                target_language: language,
                attachments: attachedFile
                    ? [{
                        name: attachedFile.name,
                        content: attachedFile.content,
                        type: attachedFile.type,
                        size: attachedFile.size
                    }]
                    : []
            }))
        }

        setInput('')
        setAttachedFile(null)
        setFileError('')
        setIsTyping(true)
    }

    const handleAttachClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0]
        event.target.value = ''
        if (!file) return

        const maxSizeBytes = 300 * 1024
        if (file.size > maxSizeBytes) {
            setFileError('File too large. Please attach a file under 300KB.')
            return
        }

        try {
            const content = await file.text()
            if (!content.trim()) {
                setFileError('Attached file is empty.')
                return
            }

            setAttachedFile({
                name: file.name,
                type: file.type || 'text/plain',
                size: file.size,
                content
            })
            setFileError('')
        } catch (error) {
            setFileError('Unable to read the file. Please try another file.')
        }
    }

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const renderSectionPanel = () => {
        if (selectedSection === 'Dashboard') {
            const stats = [
                { label: 'PRs Reviewed', value: '128', icon: Activity, trend: '+14%' },
                { label: 'Security Alerts', value: '4', icon: ShieldAlert, trend: '-8%' },
                { label: 'Active Sessions', value: '12', icon: Cpu, trend: '+5%' },
                { label: 'Avg. Response', value: '1.2s', icon: Clock3, trend: 'Stable' }
            ]

            return (
                <motion.div variants={panelContainerVariants} initial="hidden" animate="show" className="space-y-5">
                    <motion.div variants={panelItemVariants} className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 p-4 sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-cyan-300">Workspace Health</p>
                                <h3 className="mt-1 text-xl font-semibold text-white">Engineering productivity is on track</h3>
                            </div>
                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
                                Healthy
                            </span>
                        </div>
                    </motion.div>

                    <motion.div variants={panelItemVariants} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => (
                            <motion.div key={stat.label} whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-slate-400">{stat.label}</p>
                                    <stat.icon className="h-4 w-4 text-cyan-300" />
                                </div>
                                <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                                <p className="mt-1 text-xs text-slate-400">{stat.trend}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={panelItemVariants} className="grid gap-4 lg:grid-cols-2">
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                            <p className="text-sm font-semibold text-white">Weekly Velocity</p>
                            <div className="mt-4 h-2 rounded-full bg-slate-700">
                                <div className="h-2 w-[72%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" />
                            </div>
                            <p className="mt-3 text-sm text-slate-400">72% sprint completion achieved this week.</p>
                        </motion.div>
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                            <p className="text-sm font-semibold text-white">Suggested Action</p>
                            <p className="mt-3 text-sm text-slate-400">Enable auto triage for security alerts to reduce review lag by ~18%.</p>
                            <motion.button whileHover={actionButtonHover} whileTap={{ scale: 0.98 }} className="mt-4 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-400">
                                Apply Recommendation
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )
        }

        if (selectedSection === 'Agents') {
            const agents = [
                { name: 'Review Monk', status: 'Active', role: 'Code review and security checks', load: 68 },
                { name: 'Codebase Sherpa', status: 'Active', role: 'Code explanation and guidance', load: 54 },
                { name: 'Orchestrator', status: 'Active', role: 'Task routing and coordination', load: 40 }
            ]

            return (
                <motion.div variants={panelContainerVariants} initial="hidden" animate="show" className="space-y-5">
                    <motion.div variants={panelItemVariants} className="rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/5 p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.15em] text-purple-300">Agent Control</p>
                                <h3 className="mt-1 text-xl font-semibold text-white">Multi-agent pipeline running live</h3>
                            </div>
                            <Sparkles className="h-5 w-5 text-purple-300" />
                        </div>
                    </motion.div>

                    <motion.div variants={panelItemVariants} className="grid gap-4 md:grid-cols-2">
                        {agents.map((agent) => (
                            <motion.div key={agent.name} whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
                                    <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">{agent.status}</span>
                                </div>
                                <p className="mt-3 text-sm text-slate-400">{agent.role}</p>
                                <div className="mt-4">
                                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                                        <span>Current Load</span>
                                        <span>{agent.load}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-slate-700">
                                        <div className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400" style={{ width: `${agent.load}%` }} />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <motion.button whileHover={secondaryButtonHover} whileTap={{ scale: 0.98 }} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/10">
                                        View Logs
                                    </motion.button>
                                    <motion.button whileHover={actionButtonHover} whileTap={{ scale: 0.98 }} className="rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-400">
                                        Assign Task
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )
        }

        if (selectedSection === 'Projects') {
            const projects = [
                { name: 'Frontend redesign', updated: '2 hours ago', status: 'In Progress', progress: 72 },
                { name: 'Webhook integration', updated: 'Yesterday', status: 'Review Needed', progress: 88 },
                { name: 'Performance tuning', updated: '3 days ago', status: 'Completed', progress: 100 }
            ]

            return (
                <motion.div variants={panelContainerVariants} initial="hidden" animate="show" className="space-y-4">
                    <motion.div variants={panelItemVariants} className="rounded-2xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 p-4 sm:p-5">
                        <h3 className="text-xl font-semibold text-white">Project Workspace</h3>
                        <p className="mt-2 text-sm text-slate-300">Track delivery progress, code health, and pending reviews in one place.</p>
                    </motion.div>

                    <motion.div variants={panelItemVariants} className="space-y-3">
                        {projects.map((project) => (
                            <motion.div key={project.name} whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="text-base font-semibold text-white">{project.name}</h3>
                                    <span className={`rounded-full px-2 py-1 text-xs ${project.status === 'Completed'
                                        ? 'bg-emerald-500/20 text-emerald-300'
                                        : project.status === 'Review Needed'
                                            ? 'bg-amber-500/20 text-amber-300'
                                            : 'bg-cyan-500/20 text-cyan-300'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-slate-400">Updated: {project.updated}</p>
                                <div className="mt-3 h-2 rounded-full bg-slate-700">
                                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: `${project.progress}%` }} />
                                </div>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs text-slate-400">{project.progress}% complete</p>
                                    <motion.button whileHover={secondaryButtonHover} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10">
                                        <GitBranch className="h-3.5 w-3.5" />
                                        Open Board
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )
        }

        if (selectedSection === 'Settings') {
            const handleModelSwitch = async (e) => {
                const provider = e.target.value;
                try {
                    const res = await fetch('http://localhost:8000/api/models/switch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ provider })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setModels(prev => ({ ...prev, active: data.active }));
                    }
                } catch (error) {
                    console.error("Failed to switch model");
                }
            };

            return (
                <motion.div variants={panelContainerVariants} initial="hidden" animate="show" className="space-y-4">
                    <motion.div variants={panelItemVariants} className="rounded-2xl border border-emerald-500/25 bg-gradient-to-r from-emerald-500/10 to-cyan-500/5 p-4 sm:p-5">
                        <h3 className="text-xl font-semibold text-white">Workspace Settings</h3>
                        <p className="mt-2 text-sm text-slate-300">Tune assistant behavior, model routing, and notification preferences.</p>
                    </motion.div>

                    <motion.div variants={panelItemVariants} className="grid gap-3 md:grid-cols-2">
                        {/* Notifications */}
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="h-4 w-4 text-cyan-300" />
                                    <p className="text-sm text-slate-300">Realtime notifications</p>
                                </div>
                                <motion.button onClick={() => setNotificationsEnabled(!notificationsEnabled)} whileHover={secondaryButtonHover} whileTap={{ scale: 0.98 }} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                                    {notificationsEnabled ? 'Disable' : 'Enable'}
                                </motion.button>
                            </div>
                            <p className="mt-2 text-base font-medium text-white">{notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
                        </motion.div>

                        {/* Auto Code Review */}
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4 flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                                    <p className="text-sm text-slate-300">Auto code review</p>
                                </div>
                                <motion.button onClick={() => setAutoReviewEnabled(!autoReviewEnabled)} whileHover={secondaryButtonHover} whileTap={{ scale: 0.98 }} className="rounded-lg border border-white/15 px-2 py-1 text-[11px] text-slate-200 hover:bg-white/10">
                                    {autoReviewEnabled ? 'Disable' : 'Enable'}
                                </motion.button>
                            </div>
                            <p className="mt-2 text-base font-medium text-white">{autoReviewEnabled ? 'Enabled' : 'Disabled'}</p>
                        </motion.div>

                        {/* Language Preference */}
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <div className="flex items-center mb-2 gap-2">
                                <Globe2 className="h-4 w-4 text-cyan-300" />
                                <p className="text-sm text-slate-300">Language preference</p>
                            </div>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                            >
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                                <option value="Bengali">Bengali</option>
                                <option value="Tamil">Tamil</option>
                                <option value="Hinglish">Hinglish</option>
                            </select>
                        </motion.div>

                        {/* Model Backend */}
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                            <div className="flex items-center mb-2 gap-2">
                                <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
                                <p className="text-sm text-slate-300">Model backend</p>
                            </div>
                            <select
                                value={models.active || 'mock'}
                                onChange={handleModelSwitch}
                                className="w-full mt-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none"
                            >
                                {Object.keys(models.available || {}).length > 0 ? (
                                    Object.keys(models.available).map(key => (
                                        <option key={key} value={key}>{models.available[key]}</option>
                                    ))
                                ) : (
                                    <option value="mock">Demo Mode (Mock)</option>
                                )}
                            </select>
                        </motion.div>

                        {/* API keys config */}
                        <motion.div whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4 md:col-span-2">
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="h-4 w-4 text-cyan-300" />
                                    <p className="text-sm text-slate-300">Override API Provider Key</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <input
                                    type="password"
                                    value={apiKeyInput}
                                    onChange={(e) => setApiKeyInput(e.target.value)}
                                    placeholder="Enter backend API Key to override defaults"
                                    className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none"
                                />
                                <motion.button
                                    onClick={() => {
                                        if (!apiKeyInput) return;
                                        fetch('http://localhost:8000/api/models/key', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ provider: models.active, key: apiKeyInput })
                                        })
                                            .then(res => res.json())
                                            .then(data => alert(data.status === 'success' ? 'API Key saved securely to active model backend.' : 'Failed to save API key.'));
                                    }}
                                    whileHover={secondaryButtonHover} whileTap={{ scale: 0.98 }}
                                    className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-400"
                                >
                                    Save Key
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>

                    <motion.div variants={panelItemVariants} whileHover={panelCardHover} className="glass-hover-card rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-slate-300">Run quick diagnostics for latency, websocket health, and agent sync.</p>
                            <motion.button onClick={() => {
                                fetch('http://localhost:8000/api/aws-status')
                                    .then(res => res.json())
                                    .then(data => alert(JSON.stringify(data, null, 2)))
                                    .catch(err => alert('Backend offline'));
                            }} whileHover={actionButtonHover} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-900 hover:bg-cyan-400">
                                <PlayCircle className="h-4 w-4" />
                                Run Diagnostics
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )
        }

        return null
    }

    const sectionDescription = {
        Dashboard: 'Live metrics, velocity, and engineering health overview.',
        Agents: 'Control active AI agents and monitor runtime load.',
        Projects: 'Track deliveries, review status, and sprint progress.',
        Settings: 'Configure model behavior, alerts, and workspace preferences.'
    }

    const Sidebar = ({ mobile = false }) => (
        <div className="flex h-full flex-col">
            <div className="border-b border-white/10 px-5 py-5">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-slate-900/70 border border-white/10 flex items-center justify-center">
                        <img src={Logo} alt="CodeSherpa Logo" className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-white">CodeSherpa</p>
                        <p className="text-xs text-slate-400">Engineering AI Suite</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 px-3 py-5 space-y-2">
                {navItems.map((item) => (
                    <motion.button
                        whileHover={{ x: 6, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        key={item.label}
                        onClick={() => handleNavClick(item, mobile)}
                        className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${selectedSection === item.label
                            ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30'
                            : 'text-slate-300 hover:bg-white/10'
                            }`}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </motion.button>
                ))}
            </div>

            <div className="border-t border-white/10 px-5 py-6 text-center">
                <p className="text-xs font-semibold text-slate-200">AWS Bedrock</p>
                <p className="text-xs text-slate-400">Claude 3.5</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen text-white">
            <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-slate-950/70 backdrop-blur-xl lg:block">
                <Sidebar />
            </aside>

            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                            onClick={() => setIsMobileSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-white/10 bg-slate-950/95 backdrop-blur-xl lg:hidden"
                        >
                            <div className="absolute right-3 top-3">
                                <motion.button
                                    whileHover={iconButtonHover}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="rounded-lg p-2 text-slate-300 hover:bg-white/10"
                                >
                                    <X className="h-5 w-5" />
                                </motion.button>
                            </div>
                            <Sidebar mobile />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl lg:left-72"
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-4 sm:px-4">
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={iconButtonHover}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </motion.button>
                        <motion.button
                            whileHover={iconButtonHover}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/')}
                            className="rounded-lg p-2 transition-colors hover:bg-white/10"
                        >
                            <Home className="h-5 w-5" />
                        </motion.button>
                        <div>
                            <h1 className="text-xl font-bold text-white">{selectedSection}</h1>
                            <div className="flex items-center gap-2 text-xs">
                                <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-red-500'}`} />
                                <span className="text-slate-400">{isConnected ? 'Backend Connected' : 'Backend Offline'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden flex-1 max-w-xl md:block">
                        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-900/50 px-3 py-2">
                            <Search className="h-4 w-4 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300 sm:inline">
                            System Active
                        </span>
                        <motion.button whileHover={iconButtonHover} whileTap={{ scale: 0.95 }} className="rounded-lg p-2 text-slate-300 hover:bg-white/10">
                            <Bell className="h-5 w-5" />
                        </motion.button>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/90 font-bold text-slate-900">
                            U
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="px-3 pb-6 pt-24 sm:px-4 lg:pl-[19rem]">
                <div className="mx-auto w-full max-w-6xl">
                    <AnimatePresence mode="wait">
                        {selectedSection === 'Chat' ? (
                            <motion.div
                                key="chat-panel"
                                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.35)]"
                            >
                                <div className="h-[calc(100vh-260px)] min-h-[360px] max-h-[660px] overflow-y-auto p-4 sm:p-6">
                                    <AnimatePresence>
                                        {messages.map((msg, index) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.25, delay: index * 0.02 }}
                                                className={`mb-6 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`max-w-[88%] sm:max-w-[80%] ${msg.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                                    <motion.div
                                                        whileHover={{ y: -1, scale: 1.003, boxShadow: msg.sender === 'user' ? '0 10px 20px rgba(6,182,212,0.18)' : '0 10px 20px rgba(59,130,246,0.12)' }}
                                                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                                                        className={`rounded-2xl p-4 ${msg.sender === 'user'
                                                            ? 'bg-cyan-500/90 text-slate-950'
                                                            : 'border border-white/10 bg-slate-900/70'
                                                            }`}>
                                                        <div className={`prose max-w-none ${msg.sender === 'user' ? 'prose-slate' : 'prose-invert'}`}>
                                                            <ReactMarkdown
                                                                components={{
                                                                    code({ inline, className, children, ...props }) {
                                                                        const match = /language-(\w+)/.exec(className || '')
                                                                        return !inline && match ? (
                                                                            <div className="group relative">
                                                                                <SyntaxHighlighter
                                                                                    {...props}
                                                                                    style={vscDarkPlus}
                                                                                    language={match[1]}
                                                                                    PreTag="div"
                                                                                    className="rounded-lg !bg-slate-900"
                                                                                >
                                                                                    {String(children).replace(/\n$/, '')}
                                                                                </SyntaxHighlighter>
                                                                                <button
                                                                                    onClick={() => copyToClipboard(String(children), msg.id)}
                                                                                    className="absolute right-2 top-2 rounded-lg bg-slate-800 p-2 opacity-0 transition-opacity group-hover:opacity-100"
                                                                                >
                                                                                    {copiedId === msg.id ? (
                                                                                        <Check className="h-4 w-4 text-emerald-400" />
                                                                                    ) : (
                                                                                        <Copy className="h-4 w-4 text-white" />
                                                                                    )}
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            <code {...props} className="rounded bg-slate-800 px-1 py-0.5 text-sm">
                                                                                {children}
                                                                            </code>
                                                                        )
                                                                    }
                                                                }}
                                                            >
                                                                {msg.text}
                                                            </ReactMarkdown>
                                                        </div>
                                                        <div className={`mt-2 text-right text-xs ${msg.sender === 'user' ? 'text-slate-800/70' : 'text-slate-400'}`}>
                                                            {msg.timestamp}
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-6 flex justify-start"
                                        >
                                            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                                                <div className="flex gap-2">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                        className="h-2 w-2 rounded-full bg-cyan-400"
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                        className="h-2 w-2 rounded-full bg-blue-400"
                                                    />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                        className="h-2 w-2 rounded-full bg-indigo-400"
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="border-t border-white/10 bg-slate-900/70 p-3 sm:p-4">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="flex gap-2 sm:gap-3">
                                        <motion.button
                                            whileHover={secondaryButtonHover}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={handleAttachClick}
                                            className="rounded-xl border border-white/15 px-3 py-3 text-slate-200 hover:bg-white/10"
                                            title="Attach file"
                                        >
                                            <Paperclip className="h-5 w-5" />
                                        </motion.button>
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Type your message..."
                                            disabled={!isConnected}
                                            className="flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500/50 focus:outline-none disabled:opacity-50"
                                        />
                                        <motion.button
                                            whileHover={actionButtonHover}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={sendMessage}
                                            disabled={(!input.trim() && !attachedFile) || !isConnected}
                                            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isTyping ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                    {(attachedFile || fileError) && (
                                        <div className="mt-2">
                                            {attachedFile && (
                                                <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300">
                                                    <FileText className="h-3.5 w-3.5 text-cyan-300" />
                                                    <span className="max-w-[240px] truncate">{attachedFile.name}</span>
                                                    <button
                                                        onClick={() => setAttachedFile(null)}
                                                        className="text-slate-400 hover:text-white"
                                                    >
                                                        <X className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            )}
                                            {fileError && (
                                                <p className="mt-1 text-xs text-rose-300">{fileError}</p>
                                            )}
                                        </div>
                                    )}
                                    <div className="mt-2 text-center text-[11px] text-slate-400">
                                        Backend: AWS Bedrock | Model: Claude 3.5
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`${selectedSection}-panel`}
                                initial={{ opacity: 0, y: 18, scale: 0.99 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -12, scale: 0.99 }}
                                transition={{ duration: 0.28, ease: 'easeOut' }}
                                className="glass-hover-card rounded-3xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md sm:p-6"
                            >
                                <div className="glass-hover-card mb-4 rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3">
                                    <p className="text-xs uppercase tracking-[0.14em] text-cyan-300">{selectedSection}</p>
                                    <p className="mt-1 text-sm text-slate-300">{sectionDescription[selectedSection]}</p>
                                </div>
                                {renderSectionPanel()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default ChatPage

