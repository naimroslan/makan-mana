import { useEffect, useState } from "react";
import Modal from "@Components/Modal/Modal";
import { BACKEND } from "@Utils/api";
import AnnouncementContent from "./AnnouncementContent";
import type { Announcement } from "@Types/components/AnnouncementContent.type";

const AnnouncementModal = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const res = await fetch(BACKEND.ANNOUNCEMENT);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.announcements);
      }
    };

    fetchAnnouncements();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <Modal isOpen={true} onClose={() => setAnnouncements([])} scrollable>
      <AnnouncementContent
        announcements={announcements}
        current={current}
        setCurrent={setCurrent}
      />
    </Modal>
  );
};

export default AnnouncementModal;
