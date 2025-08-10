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
    { id: "/", icon: RiHome6Fill },
    { id: "/lists", icon: RiFileList3Fill },
    { id: "/chat", icon: RiChatAiFill },
    { id: "/map", icon: RiMap2Fill },
    { id: "/about", icon: RiUserSmileFill },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex gap-4 px-4 py-2 bg-white rounded-full shadow-lg">
        {navItems.map(({ id, icon: Icon }) => {
          const isActive = active === id;

          return (
            <Link
              to={id}
              key={id}
              className="flex items-center justify-center w-10 h-10 rounded-full"
            >
              <Icon
                size={22}
                className={isActive ? "text-secondary" : "text-gray-500"}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default Navbar;
