import { useEffect, useState } from "react";
import AdminNav from "../../components/Menu/AdminNav";
import DashboardView from "../admin/index";
import CreateView from "../admin/create";
import UpdateView from "../admin/update";
import DeleteView from "../admin/delete";
import { useNavigate } from "react-router-dom";
import { getLocalItem } from "../../utils/session";

export default function Admin() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState("Dashboard");
  const [form, setForm] = useState({
    slug: "",
    latitude: "",
    longitude: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    const token = getLocalItem<string>("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await fetch(`${process.env.MAKANMANA_API_URL}/add-location`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...form,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        }),
      });

      if (res.ok) {
        setStatus("Location added successfully.");
        setForm({ slug: "", latitude: "", longitude: "" });
      } else {
        const data = await res.json();
        setStatus(data.error || "Failed to add location.");
      }
    } catch (err) {
      setStatus("Network error.");
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const slugified = raw
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-");
    setForm({ ...form, slug: slugified });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderView = () => {
    switch (menu) {
      case "Dashboard":
        return <DashboardView />;
      case "Create":
        return (
          <CreateView
            form={form}
            setForm={setForm}
            status={status}
            setStatus={setStatus}
            handleSubmit={handleSubmit}
            handleSlugChange={handleSlugChange}
          />
        );
      case "Update":
        return (
          <UpdateView
            form={form}
            setForm={setForm}
            status={status}
            setStatus={setStatus}
            handleSubmit={handleSubmit}
            handleSlugChange={handleSlugChange}
          />
        );
      case "Delete":
        return (
          <DeleteView
            form={form}
            setForm={setForm}
            status={status}
            setStatus={setStatus}
            handleSubmit={handleSubmit}
            handleSlugChange={handleSlugChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AdminNav current={menu} onSelect={setMenu} />

      <div className="max-w-md mx-auto mt-10 p-6 bg-white/60 backdrop-blur-xl">
        {renderView()}
      </div>
    </>
  );
}
