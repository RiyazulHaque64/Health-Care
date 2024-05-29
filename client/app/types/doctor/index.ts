export interface IDoctor {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  doctorSpecialities?: ISpecialties[];
}

export interface ISpecialties {
  id: string;
  title: string;
  icon: string;
}
