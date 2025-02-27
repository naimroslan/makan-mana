import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { AiOutlineMessage, AiOutlineClose, AiOutlineSend } from 'react-icons/ai';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatButton() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // open chat with animation
  const openChat = useCallback(() => {
    if (!chatContainerRef.current || !chatBoxRef.current) return;

    setIsChatOpen(true);

    const timeline = gsap.timeline();

    timeline
      .to(chatContainerRef.current, {
        width: "400px",
        height: "600px",
        borderRadius: "16px",
        duration: 0.4,
        ease: "power2.inOut"
      })
      .from(chatBoxRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.out"
      });

      inputRef.current?.focus();
  }, []);

  // close chat with animation
  const closeChat = useCallback(() => {
    if (!chatContainerRef.current || !chatBoxRef.current) return;

    const timeline = gsap.timeline();

    timeline
      .to(chatBoxRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.in"
      })
      .to(chatContainerRef.current, {
        width: "56px",
        height: "56px",
        borderRadius: "28px",
        duration: 0.4,
        ease: "power2.inOut",
        onComplete: () => {
          setIsChatOpen(false);
          setChatText("");
        }
      });
  }, []);

  // Handle API Call
  const sendMessage = async () => {
    if (!chatText.trim() || loading) return;

    const userMessage: ChatMessage = {
      text: chatText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setChatText("");
    setLoading(true);

    try {
      const response = await fetch("https://api.naimroslan.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chatText }),
      });

      const data = await response.json();
      const aiMessage: ChatMessage = {
        text: data.response || "Sorry, I couldn't understand that.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message: ", error);
      const errorMessage: ChatMessage = {
        text: "Error: Unable to get a response.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  // Handle "Enter" key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    } else if (e.key === "Escape") {
      closeChat();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 w-full md:w-auto z-50">
      <div
        ref={chatContainerRef}
        className="w-14 h-14 bg-white shadow-lg overflow-hidden ml-auto 
          flex flex-col transition-shadow hover:shadow-xl"
        style={{ borderRadius: "28px" }}
      >
        {isChatOpen ? (
          <div
            ref={chatBoxRef}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Chat Assistant</h3>
              <button
                onClick={closeChat}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isUser
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-2 text-gray-800">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex items-center space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 
                    focus:ring-purple-600 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatText.trim() || loading}
                  className={`p-2 rounded-lg transition-colors ${
                    chatText.trim() && !loading
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <AiOutlineSend size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={openChat}
            className="w-full h-full flex items-center justify-center text-purple-600 
              hover:text-purple-700 transition-colors"
          >
            <AiOutlineMessage size={24} />
          </button>
        )}
      </div>
    </div>
  );
}