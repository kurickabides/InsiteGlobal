// ================================================
// ✅ Component: ItemTableView
// Description: Reusable table view for displaying GalleryItem objects with dynamic columns and a left-aligned View button
// Author: NimbusCore.OpenAI
// Architect: Chad Martin
// Company: CryoRio
// Filename: components/ui/lists/ItemTableView.tsx
// ================================================

import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TableContainer,
  Paper,
  TablePagination,
} from "@mui/material";
import {
  GalleryItem,
  GalleryListViewProps,
} from "../../../modules/galleryListView/types";

const baseFields = [
  "id",
  "label",
  "description",
  "splashImage",
  "createdDate",
  "lastUpdated",
];

const ItemTableView: React.FC<GalleryListViewProps> = ({
  items,
  itemsPerPage = 6,
  onItemClick,
  settings,
  onSettingsUpdate, // ✅ Required prop from GalleryListViewProps
}) => {
  const [page, setPage] = React.useState(0);

  const handleChangePage = (_event: unknown, newPage: number) =>
    setPage(newPage);

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPage(0);
  };

  const startIndex = page * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  const extraFieldKeys = React.useMemo(() => {
    const allKeys = new Set<string>();
    items.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!baseFields.includes(key)) allKeys.add(key);
      });
    });
    return Array.from(allKeys);
  }, [items]);

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>View</TableCell>
            <TableCell>Label</TableCell>
            {settings?.showDescription && <TableCell>Description</TableCell>}
            <TableCell>Created Date</TableCell>
            <TableCell>Last Updated</TableCell>
            {extraFieldKeys.map((key) => (
              <TableCell key={key}>{key}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {currentItems.map((item) => (
            <TableRow key={item.id} hover>
              <TableCell>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onItemClick(item.id)}
                >
                  View
                </Button>
              </TableCell>
              <TableCell>{item.label}</TableCell>
              {settings?.showDescription && (
                <TableCell>{item.description}</TableCell>
              )}
              <TableCell>{item.createdDate}</TableCell>
              <TableCell>{item.lastUpdated}</TableCell>
              {extraFieldKeys.map((key) => (
                <TableCell key={key}>{(item as any)[key]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={items.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={itemsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default ItemTableView;
