export interface ITicket {
  _id?: string;
  requestFromUserId?: string;
  assignedToUserId?: string;
  callMedium?: string;
  department?: string;
  natureOfCall?: string;
  email?: string;
  category?: string;
  subCategory?: string;
  callStatus?: string;
  priority?: string;
  description?: string;
}
