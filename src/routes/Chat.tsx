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

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initial message setup
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
          text: json.response || "Sorry, I couldn't find anything 😅",
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Something went wrong. Try again later.", isUser: false },
      ]);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-white">
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
      <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl z-0" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="relative flex items-center justify-center px-4 py-6">
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 bg-white shadow-md rounded-full p-4"
          >
            <RiArrowLeftLine size={30} className="text-primary" />
          </button>
          <h1 className="text-3xl font-bold text-primary">Chat</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[80%] p-3 text-[15px] leading-snug rounded-2xl ${
                msg.isUser
                  ? "bg-primary-light text-primary ml-auto rounded-br-md"
                  : "bg-primary text-white rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input field */}
        <div className="px-4 py-3">
          <div className="flex items-center bg-primary-light rounded-full p-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about food..."
              className="flex-1 bg-transparent focus:outline-none text-primary px-2 text-[15px]"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="px-5 py-3 rounded-full text-xl font-bold transition-colors bg-primary text-white"
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
