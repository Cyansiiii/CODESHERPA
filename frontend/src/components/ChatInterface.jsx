import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Upload,
  Mic,
  Loader2,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      text: "Namaste! 🙏 I'm CodeSherpa. How can I help you today? I can review your PRs or explain code in Hindi/English.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // Connect to WebSocket
    const wsUrl =
      import.meta.env.VITE_WS_URL || "wss://codesherpa-i47c.onrender.com/ws";
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("Connected to CodeSherpa Backend");
      setIsConnected(true);
    };

    ws.current.onclose = () => {
      console.log("Disconnected");
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // data formats from backend
      // { "type": "status", "content": "thinking" }
      // { "type": "response", "content": { "reply": "...", "review": {...} } } or just raw string in early phase?
      // handling both simple structure for now

      if (data.type === "status" && data.content === "thinking") {
        setIsTyping(true);
      } else if (data.type === "response") {
        setIsTyping(false);
        const agentResponse = data.content;

        let textContent = "";
        let reviewData = null;

        // If response is complex object (Review Monk)
        if (typeof agentResponse === "object") {
          if (agentResponse.error) {
            textContent = `⚠️ **Error:** ${agentResponse.error}`;
          } else if (agentResponse.reply) {
            textContent = agentResponse.reply;
          } else if (agentResponse.summary) {
            // It's a review!
            reviewData = agentResponse;
            textContent = `**Review Summary:**\n${agentResponse.summary}\n\n**Quality Score:** ${agentResponse.quality_score}/10`;
          } else if (agentResponse.explanation) {
            // It's a sherpa explanation
            textContent = `${agentResponse.explanation}\n\n**Key Concepts:**\n${agentResponse.key_concepts.map((k) => `- ${k.term}: ${k.definition}`).join("\n")}\n\n**Analogy:**\n> ${agentResponse.analogy}`;
          } else {
            // Fallback: If we don't recognize the object, show it as JSON
            textContent = `\`\`\`json\n${JSON.stringify(agentResponse, null, 2)}\n\`\`\``;
          }
        } else {
          // Simple string
          textContent = agentResponse;
        }

        const newMessage = {
          id: Date.now(),
          sender: "agent",
          text: textContent,
          reviewData: reviewData, // Access for custom rendering if needed
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Send to backend
    if (ws.current && isConnected) {
      ws.current.send(
        JSON.stringify({
          message: input,
          session_id: "demo-session-1", // generic session for now
        }),
      );
    }

    setInput("");
    setIsTyping(true);
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-4xl bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="shrink-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">CodeSherpa Assistant</h3>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
              ></span>
              <p className="text-xs text-gray-400">
                {isConnected ? "Online" : "Disconnected"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="group relative text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-gray-600/30 overflow-hidden">
            <span className="relative z-10">Hindi Mode 🇮🇳</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button className="group relative text-xs bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:bg-blue-600/30 px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-blue-500/30 hover:border-blue-400 overflow-hidden">
            <span className="relative z-10">AWS Bedrock Active</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full",
              msg.sender === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl p-4",
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-800 text-gray-200 rounded-bl-none border border-gray-700",
              )}
            >
              <div className="markdown-content text-sm">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          {...props}
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code {...props} className={className}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              <span className="text-[10px] opacity-50 block text-right mt-2">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="bg-gray-800 rounded-2xl p-4 rounded-bl-none border border-gray-700">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex gap-2">
          <button className="group relative p-3 text-gray-400 hover:text-white bg-gray-700/50 rounded-lg transition-all duration-300 hover:bg-gray-700 hover:scale-110 hover:shadow-lg hover:shadow-gray-600/30 overflow-hidden">
            <Mic
              size={20}
              className="relative z-10 transition-transform group-hover:scale-110"
            />
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-lg bg-white/10 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-500" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about your code, paste a PR link, or say 'Namaste'..."
            className="group flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:bg-gray-800 focus:shadow-lg focus:shadow-blue-500/20 transition-all duration-300 placeholder:text-gray-500 hover:border-gray-600"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !isConnected}
            className="group relative p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all duration-500 hover:scale-110 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:-translate-y-0 overflow-hidden"
          >
            <Send
              size={20}
              className="relative z-10 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
            />

            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" />

            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-lg bg-white/20 scale-0 group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 -z-10" />

            {/* Particle effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full animate-ping animation-delay-200" />
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-400" />
            </div>
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-gray-500">
            Powered by AWS Bedrock & Claude Sonnet • Made for India 🇮🇳
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
