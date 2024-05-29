export enum tagTypes {
  admin = "admin",
  specialities = "specialities",
  doctors = "doctors",
  patient = "patient",
  schedule = "schedule",
  appointment = "appointment",
  doctorSchedule = "doctorSchedule",
  user = "user",
  prescription = "prescription",
  review = "review",
}

const tagTypesList = [
  tagTypes.specialities,
  tagTypes.doctors,
  tagTypes.admin,
  tagTypes.patient,
  tagTypes.schedule,
  tagTypes.appointment,
  tagTypes.doctorSchedule,
  tagTypes.user,
  tagTypes.prescription,
  tagTypes.review,
];

export default tagTypesList;
