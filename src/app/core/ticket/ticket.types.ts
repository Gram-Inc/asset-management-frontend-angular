export interface ITicket {
  _id?: string;
  callesAttenedByUser?: Partial<ICallesAttenedByUser[]>;
  description?: string;
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
  createdAt?: string;
}
export interface ICallesAttenedByUser {
  userId?: string;
  from?: string;
  _id?: string;
}
