"use client";

import {
  useDeleteSpecialtyMutation,
  useGetAllSpecialitiesQuery,
} from "@/app/redux/api/specialitiesApi";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import SpecialtyModal from "./components/SpecialtyModal";

const SpecialtiesPage = () => {
  const { data, isLoading } = useGetAllSpecialitiesQuery({});

  const [deleteSpecialty] = useDeleteSpecialtyMutation();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleSpecialtyDelete = async (id: string) => {
    try {
      const res = await deleteSpecialty(id).unwrap();
      if (res?.success) {
        toast.success("Delete specialty successfully");
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 400 },
    {
      field: "icon",
      headerName: "Icon",
      flex: 1,
      renderCell: ({ row }) => (
        <Stack>
          <Image src={row.icon} alt="icon" width={30} height={30} />
        </Stack>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <IconButton
          aria-label="delete"
          onClick={() => handleSpecialtyDelete(row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={handleModalOpen}>Create Specialty</Button>
        <SpecialtyModal open={isModalOpen} setOpen={setIsModalOpen} />
        <TextField size="small" placeholder="Search Specialist" />
      </Stack>
      <Box mt={2}>
        {isLoading ? (
          <Typography variant="h6">Loading....</Typography>
        ) : data?.length > 0 ? (
          <DataGrid rows={data} columns={columns} hideFooter={true} />
        ) : (
          <Typography variant="h6" sx={{ color: "#f44336" }}>
            There was an error
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SpecialtiesPage;
