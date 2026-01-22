import type { Props } from "@Types/components/AnnouncementContent.type";

const AnnouncementContent = ({ announcements, current, setCurrent }: Props) => {
  const currentAnnouncement = announcements[current];

  return (
    <div>
      <h2 className="text-xl font-semibold text-primary text-center mb-4">
        Announcement
      </h2>

      <div className="text-base text-gray-700 leading-relaxed">
        {currentAnnouncement.announcement?.content?.value?.document?.children.map(
          (node, idx) => (
            <p key={idx} className="mb-2">
              {node.children?.map((span) => span.value).join("")}
            </p>
          ),
        )}
      </div>

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
  );
};

export default AnnouncementContent;
