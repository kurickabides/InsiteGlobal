//type file for NEWS

export interface IAnnouncement {
  id: string; // maps to AnnouncementID
  portalId: string;
  title: string;
  content: string;
  category?: string;
  postedOn: string;
  author?: string;
  imageUrl?: string;
  slug?: string;
  isActive?: boolean;
}
