import { useEffect, useState } from "react";
import { BACKEND } from "../../utils/api";

type Announcement = {
  id: string;
  title: string;
  announcement: {
    content: {
      value: any;
      links: any[];
      inlineBlocks: any[];
      blocks: any[];
    };
  };
};

export default function AnnouncementModal() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      console.log("🌐 Fetching:", BACKEND.ANNOUNCEMENT);
      const res = await fetch(BACKEND.ANNOUNCEMENT);
      const data = await res.json();
      console.log("📢 Response:", data);

      if (data.success) {
        setAnnouncements(data.announcements);
      }
    };

    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  const currentAnnouncement = announcements[current];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Close Button */}
        <button
          onClick={() => setAnnouncements([])}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-primary text-center mb-4">
          Announcement
        </h2>

        {/* Content */}
        <div className="text-base text-gray-700 leading-relaxed">
          {currentAnnouncement.announcement?.content?.value?.document?.children.map(
            (node, idx) => (
              <p key={idx} className="mb-2">
                {node.children?.map((span) => span.value).join("")}
              </p>
            ),
          )}
        </div>

        {/* Pagination Indicator */}
        {announcements.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {announcements.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: i === current ? "#4B5563" : "#D1D5DB",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
