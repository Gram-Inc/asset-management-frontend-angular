import { IClient } from "../client/client.types";
import { IUser } from "../user/user.types";

export interface IAssignment {
  _id: string;
  client: string | IClient;
  callMedium: string;
  department: string;
  natureOfCall: string;
  email: string;
  category: string;
  subCategory: string;
  callStatus: string;
  priority: "Low" | "Medium" | "High";
  description: string;
  assignedToUser: null | IUser;
  requestFromUserId: null | IUser;
  createdAt: string;
  updatedAt: string;

  dueDate: string;
}
