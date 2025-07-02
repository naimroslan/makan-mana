import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSendPlaneLine, RiArrowLeftLine } from "react-icons/ri";
import { gsap } from "gsap";

interface Message {
  text: string;
  isUser: boolean;
}

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialQuery = location.state?.query || "";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState(initialQuery);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const purpleBlobRef = useRef<HTMLDivElement>(null);
  const blueBlobRef = useRef<HTMLDivElement>(null);
  const hasSentInitial = useRef(false);

  // Animate blobs
  useEffect(() => {
    const animateBlob = (
      ref: React.RefObject<HTMLDivElement>,
      radius: number,
      duration: number,
      clockwise = true,
    ) => {
      let angle = 0;
      const dir = clockwise ? 1 : -1;

      gsap.to(
        {},
        {
          duration,
          repeat: -1,
          ease: "none",
          onUpdate: () => {
            angle += (dir * 2 * Math.PI) / (60 * duration);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            gsap.set(ref.current, { x, y });
          },
        },
      );
    };

    animateBlob(purpleBlobRef, 40, 10, true);
    animateBlob(blueBlobRef, 60, 14, true);
  }, []);

  // Scroll to bottom on message update or typing
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Initial welcome and optional query
  useEffect(() => {
    const welcome: Message[] = [
      { text: "What do you feel like eating?", isUser: false },
    ];
    setMessages(
      initialQuery
        ? [...welcome, { text: initialQuery, isUser: true }]
        : welcome,
    );

    if (initialQuery && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage(initialQuery, true);
    }
  }, [initialQuery]);

  const sendMessage = async (text: string, auto = false) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (!auto) {
      setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
    }

    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.MAKANMANA_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
      });

      const json = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          text:
            json.response ||
            "Oh no, my owner must have forgeten to buy more credits 🙏 I'll let him know",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Try again later.", isUser: false },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-light flex flex-col relative overflow-hidden">
      {/* Animated blobs */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div
          ref={purpleBlobRef}
          className="w-[500px] h-[400px] bg-purple-300 rounded-full mix-blend-multiply blur-2xl opacity-80"
        />
        <div
          ref={blueBlobRef}
          className="w-[500px] h-[400px] bg-blue-300 rounded-full mix-blend-multiply blur-2xl opacity-80 ml-[-200px] mt-[200px]"
        />
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-xl z-0" />

      {/* Header */}
      <header className="relative z-10 px-4 py-6 bg-transparent">
        <div className="w-full max-w-md mx-auto">
          <div className="relative flex items-center justify-center">
            <button
              onClick={() => navigate("/")}
              className="absolute left-0 p-2 -m-2"
            >
              <RiArrowLeftLine size={24} className="text-primary" />
            </button>
            <h1 className="text-2xl font-semibold text-primary">Chat</h1>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 relative z-10 px-4 pb-24">
        <div className="w-full max-w-md mx-auto h-full">
          <div className="h-full overflow-y-auto space-y-3 pr-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] p-3 text-[15px] leading-relaxed rounded-2xl ${
                  msg.isUser
                    ? "bg-secondary text-white ml-auto rounded-br-md"
                    : "bg-primary text-light rounded-bl-md shadow-sm border border-border"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="bg-primary text-light px-4 py rounded-xl rounded-bl-md inline-block border border-border w-fit">
                <span className="dot-wave">.</span>
                <span className="dot-wave animation-delay-150">.</span>
                <span className="dot-wave animation-delay-300">.</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input field */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-4 z-10 bg-gradient-to-t from-light via-light to-transparent">
        <div className="w-full max-w-md mx-auto">
          <div className="flex items-center bg-white rounded-full p-2 shadow-sm border border-border">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about food..."
              className="flex-1 bg-transparent focus:outline-none text-primary px-3 text-[15px] font-funnel font-semibold placeholder:text-gray"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className={`px-4 py-3 rounded-full text-lg transition-all ${
                inputText.trim()
                  ? "bg-primary text-white active:scale-95"
                  : "bg-muted text-gray cursor-not-allowed"
              }`}
            >
              <RiSendPlaneLine />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
