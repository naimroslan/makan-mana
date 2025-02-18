import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { AiOutlineMessage, AiOutlineClose } from 'react-icons/ai';

export function ChatButton() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatText, setChatText] = useState('');

  const toggleChat = () => {
    if (!chatContainerRef.current) return;

    if (!isChatOpen) {
      gsap.fromTo(chatContainerRef.current,
        {
          width: "56px",
          height: "56px",
          borderRadius: "28px"
        },
        {
          width: "calc(100% - 2rem)",
          height: "64px",
          borderRadius: "16px",
          duration: 0.4,
          ease: "power2.inOut"
        }
      );
    } else {
      gsap.fromTo(chatContainerRef.current,
        {
          width: "calc(100% - 2rem)",
          height: "64px",
          borderRadius: "16px"
        },
        {
          width: "56px",
          height: "56px",
          borderRadius: "28px",
          duration: 0.4,
          ease: "power2.inOut"
        }
      );
    }
    setIsChatOpen(!isChatOpen);
    setChatText('');
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 w-full md:w-auto z-50">
      <div 
        ref={chatContainerRef}
        className="w-14 h-14 bg-purple-600 shadow-lg overflow-hidden ml-auto 
          flex items-center justify-center transition-shadow hover:shadow-xl"
        style={{ borderRadius: '28px' }}
      >
        {isChatOpen ? (
          <div className="flex items-center w-full px-4 h-full">
            <input
              type="text"
              maxLength={50}
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 h-10 bg-transparent text-white placeholder-purple-200 
                outline-none border-none"
            />
            <button 
              onClick={toggleChat}
              className="ml-2 text-white hover:text-purple-200 transition-colors"
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
        ) : (
          <button 
            onClick={toggleChat}
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