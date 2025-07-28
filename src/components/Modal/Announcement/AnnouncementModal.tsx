import { useEffect, useState } from "react";
import Modal from "../Modal";
import { BACKEND } from "../../../utils/api";
import AnnouncementContent from "./AnnouncementContent";

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
}
