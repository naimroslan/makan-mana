export interface Announcement {
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
}

export interface Props {
  announcements: Announcement[];
  current: number;
  setCurrent: (i: number) => void;
}
