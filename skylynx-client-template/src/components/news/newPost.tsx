// ================================================
// ✅ Component: AnnouncementPost
// File: components/announcements/AnnouncementPost.tsx
// Description: Renders a single announcement (news-style post) from local or API source
// ================================================

import React, { useState, useEffect } from "react";
import {
  CardRoot,
  Control,
  Label,
  SectionTitle,
  CenteredMedia,
  ParagraphText,
} from "../../theme/appStyles";
import { IAnnouncement } from "./types";
import mockAnnouncements from "../../appStore/data/news.json"; // temporary mock source

const defaultState: IAnnouncement = {
  id: "",
  portalId: "",
  title: "",
  content: "",
  postedOn: "",
  category: "",
  author: "",
  imageUrl: "",
  slug: "",
  isActive: true,
};

const AnnouncementPost: React.FC = () => {
  const [announcement, setAnnouncement] = useState<IAnnouncement>(defaultState);

  useEffect(() => {
    // Replace "sample-announcement" with dynamic slug in production
    const matched = mockAnnouncements.data.find(
      (a) => a.slug === "sample-announcement"
    );
    if (matched) {
      // Enforce string-based ID format if needed
      setAnnouncement({ ...matched, id: String(matched.id) });
    }
  }, []);

  if (!announcement.imageUrl) return null;

  return (
    <CardRoot>
      <Control>
        {announcement.category && <Label>{announcement.category}</Label>}
        <SectionTitle>{announcement.title}</SectionTitle>
        <Label>{`By ${announcement.author || "Anonymous"} on ${
          announcement.postedOn
        }`}</Label>
      </Control>
      <CenteredMedia>
        <img
          src={announcement.imageUrl}
          alt={announcement.title}
          style={{ maxWidth: "100%" }}
        />
      </CenteredMedia>
      <ParagraphText>{announcement.content}</ParagraphText>
    </CardRoot>
  );
};

export default AnnouncementPost;
