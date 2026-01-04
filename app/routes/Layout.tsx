import { Outlet } from "react-router-dom";
import Navbar from "~/components/Menu/Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-light flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
