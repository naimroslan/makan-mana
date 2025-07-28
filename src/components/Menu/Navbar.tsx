import {
  RiHome6Fill,
  RiChatAiFill,
  RiUserSmileFill,
  RiMap2Fill,
  RiFileList3Fill,
} from "react-icons/ri";
import { useLocation, Link } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const active = location.pathname;

  const navItems = [
    { id: "/", icon: RiHome6Fill, label: "Home" },
    { id: "/lists", icon: RiFileList3Fill, label: "Lists" },
    { id: "/chat", icon: RiChatAiFill, label: "AI" },
    { id: "/map", icon: RiMap2Fill, label: "Map" },
    { id: "/about", icon: RiUserSmileFill, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;

          return (
            <Link
              to={id}
              key={id}
              className="flex flex-col items-center text-xs transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center mb-1">
                <Icon
                  size={24}
                  className={isActive ? "text-primary" : "text-text"}
                />
              </div>
              <span
                className={`text-[11px] ${isActive ? "text-primary" : "text-text"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
