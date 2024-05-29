export interface ISchedule {
  id: string;
  startDateTime: Date;
  endDateTime: Date;
}

export interface IScheduleForm {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}
