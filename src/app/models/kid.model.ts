export type Gender = 'Male' | 'Female' | 'Other';

export interface Kid {
  id: string;
  name: string;
  dob: string;
  gender: Gender;
  guardianName: string;
  address: string;
}
