import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MdDragIndicator } from "react-icons/md";
import { TbSend } from "react-icons/tb";

interface Message {
  text: string;
  isUser: boolean;
}

export function ChatDrawer() {
  const drawerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! How can I help you decide where to eat today?", isUser: false }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleDrawer = () => {
    if (!drawerRef.current) return;

    const drawerHeight = isOpen ? '60px' : '400px';
    
    gsap.to(drawerRef.current, {
      height: drawerHeight,
      duration: 0.4,
      ease: "power2.inOut"
    });
    
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = { text: inputText, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);
    
    try {
      const response = await fetch(`${process.env.MAKANMANA_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: inputText }),
      });

      const data = await response.json();
      const aiMessage: Message = {
        text: data.response || "Sorry, I couldn't understand that.",
        isUser: false,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message: ", error);
      setMessages((prev) => [...prev, { text: "Error: Unable to get a response.", isUser: false }]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div 
      ref={drawerRef}
      className="fixed bottom-0 left-0 right-0 bg-white border-x-2 border-t-2 border-primary-light 
        rounded-t-2xl z-40 overflow-hidden transition-shadow"
      style={{ height: '60px' }}
    >
      {/* Drawer handle */}
      <div 
        className="h-[60px] flex items-center justify-center cursor-pointer"
        onClick={toggleDrawer}
      >
        <div className="flex items-center gap-2 font-medium">
          {isOpen ? <MdDragIndicator size={20} color="text-secondary" style = {{transform: 'rotate(90deg)' }} /> : <MdDragIndicator  size={20} color="text-secondary" style = {{transform: 'rotate(90deg)' }} />}
        </div>
      </div>
      
      {/* Chat content */}
      <div className="p-4 h-[340px] flex flex-col">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser 
                  ? 'bg-bluesky text-white ml-auto rounded-br-none' 
                  : 'bg-light text-gray-800 rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
        
        {/* Input area */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about food..."
            className="flex-1 border-2 border-primary-light rounded-xl py-3 px-4"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`p-3 rounded-xl ${
              inputText.trim() 
                ? 'bg-secondary text-white hover:bg-purple-700' 
                : 'bg-gray-200 text-gray-400'
            } transition-colors`}
          >
            <TbSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}