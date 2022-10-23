export interface ITicket
{
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
   callStatus?: TicketStatus;
   priority?: TicketPriority;
   createdAt?: string;
}
export interface ICallesAttenedByUser
{
   userId?: string;
   from?: string;
   _id?: string;
}
export enum TicketPriority
{
   Low = "Low",
   Medium = "Medium",
   High = "High",
   Critical = "Critical"
}
export enum TicketStatus
{
   Assigned = "Assigned",
   Closed = "Closed",
   Hold = "Hold",
   InProgress = "In Progress",
   Open = "Open",
   VendorDependency = "Vendor Dependency"
}

export enum TicketNatureOfCall
{
   Incident = "Incident",
   Request = "Request"
}
