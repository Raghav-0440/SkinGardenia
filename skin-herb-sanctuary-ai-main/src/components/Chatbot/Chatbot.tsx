"use client";
import { useState, useRef, useEffect } from "react";
import { generateResponse } from "@/services/skinGardeniaService";
import { Send, Leaf, MessageCircle } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const suggestedQuestions = [
  "How to treat severe acne naturally?",
  "Best remedies for eczema flare-ups?",
  "Herbal solution for acne scars?",
  "Treatment for sensitive skin with acne?",
  "Plants that help both acne and eczema?"
];

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm SkinGardenia, your calm and knowledgeable herbal skincare assistant. I'm here to help you understand your skin concerns and provide season-aware, herb-based guidance. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const chatHistory = messages
        .filter(msg => msg.id !== "welcome")
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await generateResponse(text, chatHistory);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I need to reconsider your concern. Could you provide more details?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessageContent = (content: string) => {
    return (
      <div className="whitespace-pre-line">
        {content.split('\n').map((line, i) => {
          if (line.startsWith('[') && line.endsWith(']')) {
            return <div key={i} className="font-bold text-green-400">{line}</div>;
          }
          if (line.startsWith('•')) {
            return <div key={i} className="ml-4 flex">
              <span className="text-green-400 mr-2">•</span>
              <span>{line.substring(2)}</span>
            </div>;
          }
          return <div key={i}>{line}</div>;
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#222] rounded-xl p-6 border border-[#333] h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pr-2">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="flex items-start gap-2 max-w-[85%]">
              {message.role === "assistant" && (
                <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Leaf className="h-4 w-4 text-white" />
                </div>
              )}
              <div>
                <div className={`rounded-2xl px-4 py-2 text-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-[#1a1a1a] text-white border border-[#333]"
                }`}>
                  {message.role === "assistant" ? (
                    renderMessageContent(message.content)
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-2">
                  {formatTime(message.timestamp)}
                </p>
              </div>
              {message.role === "user" && (
                <div className="h-8 w-8 bg-[#333] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start gap-2 max-w-[85%]">
              <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="h-4 w-4 text-white" />
              </div>
              <div className="rounded-2xl px-4 py-2 bg-[#1a1a1a] text-white border border-[#333]">
                <div className="flex gap-1">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length < 3 && (
        <div className="py-3">
          <p className="text-gray-400 text-sm mb-2">Try asking about:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="bg-[#1a1a1a] text-gray-300 text-xs rounded-full px-3 py-1.5 border border-[#333] hover:border-green-500 hover:bg-[#252525] transition-colors"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 bg-[#1a1a1a] rounded-lg border border-[#333] p-2 flex items-center">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about any skin concern..."
          className="flex-1 bg-transparent border-none text-white focus:outline-none resize-none h-10 py-2 px-3"
          rows={1}
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isTyping}
          className={`rounded-full h-8 w-8 p-0 flex items-center justify-center ${
            input.trim() && !isTyping
              ? "bg-green-600 text-white"
              : "bg-[#333] text-gray-600"
          }`}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}