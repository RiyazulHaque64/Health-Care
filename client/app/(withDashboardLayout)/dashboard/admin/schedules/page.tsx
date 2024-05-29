"use client";

import { useGetAllSchedulesQuery } from "@/app/redux/api/schedulesApi";
import { ISchedule } from "@/app/types/schedule";
import { dateFormatter } from "@/app/utils/dateAndTimeFormatter";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ScheduleModal from "./components/ScheduleModal";

const SchedulesPage = () => {
  const [scheduleModalOpen, setScheduleModalOpen] = useState<boolean>(false);
  const [allSchedules, setAllSchedules] = useState<any>([]);
  const { data, isLoading } = useGetAllSchedulesQuery({});
  const schedules = data?.schedules;

  const columns: GridColDef[] = [
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 1,
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 1,
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: ({ row }) => (
        <Box>
          <IconButton aria-label="delete" sx={{ color: "red" }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    const formattedSchedules = schedules?.map((schedule: ISchedule) => ({
      id: schedule.id,
      startDate: dateFormatter(schedule.startDateTime),
      endDate: dateFormatter(schedule.endDateTime),
      startTime: dayjs(schedule.startDateTime).format("hh:mm A"),
      endTime: dayjs(schedule.endDateTime).format("hh:mm A"),
    }));
    setAllSchedules(formattedSchedules);
  }, [schedules]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Button onClick={() => setScheduleModalOpen(true)}>
          Create Schedules
        </Button>
        <ScheduleModal
          open={scheduleModalOpen}
          setOpen={setScheduleModalOpen}
        />
      </Stack>
      <Box mt={2}>
        {isLoading ? (
          <Typography variant="h6">Loading....</Typography>
        ) : schedules && schedules.length > 0 ? (
          <DataGrid rows={allSchedules ?? []} columns={columns} />
        ) : (
          <Typography variant="h6" sx={{ color: "#f44336" }}>
            There was an error
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default SchedulesPage;
