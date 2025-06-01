import { RiBowlFill, RiChatAiFill, RiUserSmileFill } from "react-icons/ri";
import { useLocation, Link } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const active = location.pathname;

  const navItems = [
    { id: "/", icon: <RiBowlFill size={20} />, route: "/" },
    { id: "/chat", icon: <RiChatAiFill size={20} />, route: "/chat" },
    { id: "/about", icon: <RiUserSmileFill size={20} />, route: "/about" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center justify-between gap-6 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full shadow-lg">
        {navItems.map(({ id, icon, route }) => (
          <Link
            to={route}
            key={id}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-all
              ${
                active === route
                  ? "bg-primary text-white"
                  : "text-primary hover:bg-white/10"
              }`}
          >
            {icon}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default Navbar;
