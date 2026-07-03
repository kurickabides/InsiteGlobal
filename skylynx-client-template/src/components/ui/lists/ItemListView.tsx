// ================================================
// ✅ Component: ItemListView
// Description: Reusable list view with image, label, metadata, and pagination
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/lists/ItemListView.tsx
// ================================================

import React from "react";
import {
  StyledCardContent,
  PageTitleText,
  Actions,
  FlexRowBetween,
  ParagraphText,
  ListItemCard,
  StyledPagination,
  FlexCenterRow,
} from "../../../theme/appStyles";
import {
  GalleryItem,
  GalleryListViewProps,
} from "../../../modules/galleryListView/types";
import { Button } from "@mui/material";

const THUMBNAIL_SIZE = 100;

const ItemListView: React.FC<GalleryListViewProps> = ({
  items,
  itemsPerPage = 6,
  onItemClick,
  settings,
  onSettingsUpdate, // ✅ Required prop — even if unused
}) => {
  const [page, setPage] = React.useState(1);
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const baseFields: (keyof GalleryItem)[] = [
    "label",
    "description",
    "createdDate",
    "lastUpdated",
  ];

  const getExtraFields = (item: GalleryItem) => {
    return Object.keys(item).filter(
      (key) => ![...baseFields, "id", "splashImage"].includes(key)
    );
  };

  return (
    <div>
      <div style={{ display: "grid", gap: 16 }}>
        {currentItems.map((item) => {
          const extraFields = getExtraFields(item);
          return (
            <ListItemCard key={item.id}>
              <StyledCardContent>
                <Button onClick={() => onItemClick(item.id)}>View</Button>

                {/* ✅ Left side: Image + Label + Description */}
                <FlexCenterRow style={{ gap: 12, flex: 1 }}>
                  <img
                    src={`backgrounds/${item.splashImage}`}
                    alt={item.label}
                    style={{
                      width: THUMBNAIL_SIZE,
                      height: THUMBNAIL_SIZE,
                      objectFit: "cover",
                      borderRadius: 4,
                    }}
                  />
                  <div>
                    <PageTitleText>{item.label}</PageTitleText>
                    {settings?.showDescription && item.description && (
                      <div
                        style={{
                          maxWidth: 400,
                          wordWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        <ParagraphText>{item.description}</ParagraphText>
                      </div>
                    )}
                  </div>
                </FlexCenterRow>
              </StyledCardContent>
            </ListItemCard>
          );
        })}
      </div>

      <Actions>
        <StyledPagination
          count={Math.ceil(items.length / itemsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
        />
      </Actions>
    </div>
  );
};

export default ItemListView;
