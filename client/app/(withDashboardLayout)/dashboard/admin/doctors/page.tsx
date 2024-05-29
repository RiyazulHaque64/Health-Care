"use client";

import {
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
} from "@/app/redux/api/doctorsApi";
import { useDebounced } from "@/app/redux/hooks";
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
import { useState } from "react";
import { toast } from "sonner";
import DoctorModal from "./components/DoctorModal";

const DoctorsPage = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const query: Record<string, any> = {};

  const debouncedValue = useDebounced({
    searchTerm,
    delay: 600,
  });

  if (!!debouncedValue) {
    query["searchTerm"] = debouncedValue;
  }

  const [deleteDoctor] = useDeleteDoctorMutation();
  const { data, isLoading } = useGetAllDoctorsQuery({ ...query });
  const doctors = data?.doctors;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleSpecialtyDelete = async (id: string) => {
    try {
      const res = await deleteDoctor(id).unwrap();
      if (res?.id) {
        toast.success("Doctor deleted successfully");
      }
    } catch (error: any) {
      console.error(error?.message);
    }
  };

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "contactNumber", headerName: "Contact Number", flex: 1 },
    { field: "qualification", headerName: "Qualification", flex: 1 },
    { field: "designation", headerName: "Designation", flex: 1 },
    { field: "appointmentFee", headerName: "Fee", flex: 1 },
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Button onClick={handleClickOpen}>Create New Doctor</Button>
        <DoctorModal open={open} setOpen={setOpen} />
        <TextField
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          placeholder="Search Doctors"
        />
      </Stack>
      <Box mt={2}>
        {isLoading ? (
          <Typography variant="h6">Loading....</Typography>
        ) : doctors && doctors?.length > 0 ? (
          <DataGrid rows={doctors} columns={columns} hideFooter={true} />
        ) : (
          <Typography variant="h6" sx={{ color: "#f44336" }}>
            There was an error
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default DoctorsPage;
