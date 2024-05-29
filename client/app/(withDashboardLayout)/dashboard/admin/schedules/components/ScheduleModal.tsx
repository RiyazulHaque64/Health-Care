import Form from "@/app/components/Forms/Form";
import HDatePicker from "@/app/components/Forms/HDatePicker";
import HTimePicker from "@/app/components/Forms/HTimePicker";
import Modal from "@/app/components/Shared/Modal/Modal";
import { useCreateSchedulesMutation } from "@/app/redux/api/schedulesApi";
import { dateFormatter, timeFormatter } from "@/app/utils/dateAndTimeFormatter";
import { Button, Grid } from "@mui/material";
import React from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ScheduleModal = ({ open, setOpen }: TProps) => {
  const [createSchedules] = useCreateSchedulesMutation();

  const handleFormSubmit = async (values: FieldValues) => {
    values.startDate = dateFormatter(values.startDate);
    values.endDate = dateFormatter(values.endDate);
    values.startTime = timeFormatter(values.startTime);
    values.endTime = timeFormatter(values.endTime);
    try {
      const res = await createSchedules(values).unwrap();
      if (res?.length > 0) {
        toast.success("Schedules created successfully");
        setOpen(false);
      }
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  return (
    <Modal open={open} setOpen={setOpen} title="Create Schedules">
      <Form onSubmit={handleFormSubmit}>
        <Grid container spacing={2} sx={{ width: "400px" }}>
          <Grid item md={12}>
            <HDatePicker name="startDate" label="Start Date" fullWidth />
          </Grid>
          <Grid item md={12}>
            <HDatePicker name="endDate" label="End Date" fullWidth />
          </Grid>
          <Grid item md={6}>
            <HTimePicker name="startTime" label="Start Time" fullWidth />
          </Grid>
          <Grid item md={6}>
            <HTimePicker name="endTime" label="End Time" fullWidth />
          </Grid>
        </Grid>
        <Button sx={{ mt: 1 }} type="submit">
          Create
        </Button>
      </Form>
    </Modal>
  );
};

export default ScheduleModal;
