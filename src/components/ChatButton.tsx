import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { AiOutlineMessage, AiOutlineClose, AiOutlineSend } from 'react-icons/ai';

export function ChatButton() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  // const toggleChat = () => {
  //   if (!chatContainerRef.current) return;

  //   if (!isChatOpen) {
  //     gsap.fromTo(chatContainerRef.current,
  //       {
  //         width: "56px",
  //         height: "56px",
  //         borderRadius: "28px"
  //       },
  //       {
  //         width: "calc(100% - 2rem)",
  //         height: "64px",
  //         borderRadius: "16px",
  //         duration: 0.4,
  //         ease: "power2.inOut"
  //       }
  //     );
  //   } else {
  //     gsap.fromTo(chatContainerRef.current,
  //       {
  //         width: "calc(100% - 2rem)",
  //         height: "64px",
  //         borderRadius: "16px"
  //       },
  //       {
  //         width: "56px",
  //         height: "56px",
  //         borderRadius: "28px",
  //         duration: 0.4,
  //         ease: "power2.inOut"
  //       }
  //     );
  //   }
  //   setIsChatOpen(!isChatOpen);
  //   setChatText("");
  //   setResponseText("");
  // };

  // Open Chat with animation
  const openChat = useCallback(() => {
    if (!chatContainerRef.current) return;

    gsap.to(chatContainerRef.current, {
      width: "calc(100% - 2rem)",
      height: "64px",
      borderRadius: "16px",
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setIsChatOpen(true);
        inputRef.current?.focus();
      },
    });
  }, []);

  // Close Chat with animation
  const closeChat = useCallback(() => {
    if (!chatContainerRef.current) return;

    gsap.to(chatContainerRef.current, {
      width: "56px",
      height: "56px",
      borderRadius: "28px",
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        setIsChatOpen(false);
        setChatText("");
        setResponseText("");
      },
    });
  }, []);

  // Handle API Call
  const sendMessage = async () => {
    if (!chatText.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("https://api.naimroslan.dev/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: chatText }),
      });

      const data = await response.json();
      setResponseText(data.response || "Sorry, I couldn't understand that.");
    } catch (error) {
      console.error("Error sending message: ", error);
      setResponseText("Error: Unable to get a response.");
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
        className="w-14 h-14 bg-purple-600 shadow-lg overflow-hidden ml-auto 
          flex items-center justify-center transition-shadow hover:shadow-xl"
        style={{ borderRadius: "28px" }}
      >
        {isChatOpen ? (
          <div className="flex items-center w-full px-4 h-full">
            <input
              ref={inputRef}
              type="text"
              maxLength={50}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 h-10 bg-transparent text-white placeholder-purple-200 
                outline-none border-none"
            />
            <button
              onClick={sendMessage}
              disabled={!chatText.trim() || loading}
              className={`ml-2 text-white transition-colors ${
                chatText.trim() && !loading
                  ? "hover:text-purple-200"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <AiOutlineSend size={24} />
            </button>
          </div>
        ) : (
          <button
            onClick={openChat}
            className="w-full h-full flex items-center justify-center text-white 
              hover:text-purple-200 transition-colors"
          >
            <AiOutlineMessage size={24} />
          </button>
        )}
      </div>
    </div>
  );
}