// ================================================
// ✅ Component: ImageGridView
// Description: Renders GalleryItems in a responsive image grid with optional description
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/lists/ImageGridView.tsx
// ================================================

import React from "react";
import {
  GalleryCard,
  GalleryCardContent,
  GalleryImage,
  GalleryLabel,
  GalleryDescription,
  GalleryContainer,
} from "../styled/galleryParts";
import {
  FlexRowBetween,
  PaperContainer,
  FlexCenterRow,
  Actions,
  StyledPagination,
} from "../../../theme/appStyles";
import {
  GalleryItem,
  GalleryListViewProps,
} from "../../../modules/galleryListView/types";

const ImageGridView: React.FC<GalleryListViewProps> = ({
  items,
  itemsPerPage = 6,
  onItemClick,
  settings,
  onSettingsUpdate, // ✅ Required even if unused
}) => {
  const [page, setPage] = React.useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <GalleryContainer>
        {currentItems.map((item) => (
          <GalleryCard
            key={item.id}
            onClick={() => onItemClick(item.id)}
            title={item.description || ""}
          >
            <GalleryLabel>{item.label}</GalleryLabel>
            <GalleryImage
              src={`backgrounds/${item.splashImage}`}
              alt={item.label}
            />
            <GalleryCardContent>
              {settings.showDescription && item.description && (
                <GalleryDescription>{item.description}</GalleryDescription>
              )}
            </GalleryCardContent>
          </GalleryCard>
        ))}
      </GalleryContainer>

      <Actions>
        <StyledPagination
          count={Math.ceil(items.length / itemsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
        />
      </Actions>
    </>
  );
};

export default ImageGridView;
