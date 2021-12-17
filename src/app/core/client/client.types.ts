export interface IClient {
  _id: string;
  name: string;
  mobileNumber: string;
  email: string;
  branch?: IBranch[];
}

export interface IBranch {
  location: string;
  address: string;
  gstIN: string;
  contactPerson?: IContactPerson[];
}
export interface IContactPerson {
  name: string;
  mobileNumber: string;
  email: string;
  designation: string;
}
