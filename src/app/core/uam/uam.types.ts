import { IUser } from "../user/user.types";

export interface IUAM
{
   _id?: string;
   status?: string;
   createdBy?: string | IUser;
   createdAt?: string;
   requestTypeAction?: RequestTypeActionUAM;
   uamNo?: string;
   priority?: "low" | "medium" | "high";
   uamType?: "windows" | "application";
   userInformation?: IUserInformationUAM;
   accessToShareDrives?: {
      driveName?: string;
      folderName?: string;
      accessRights?: AccessRightsUAM;
      grantRevoke?: GrantRevokeUAM;
   }[];
   userSystemDataAndEmailIdTreatment?: {
      userSystemData?: UserSystemDataUAM;
      dataHandOverTo?: string;
      endUserConfirmationOnReceiptOfData?: string;
      emailMailboxTransferredTo?: string;
      endUserConfirmationOnActivationOfMailbox?: string;
      emailIdForwardedTo?: string;
      dateTillEmailIdToRemainActive?: string;
      endUserConfirmatinoOnEmailForwarding?: string;
   };
   uamApprovals?: {
      requestedBy?: {
         name?: string;
         signature?: string;
         approvalDate?: string;
      };
      headOfDepartmentDesignee?: {
         name?: string;
         signature?: string;
         approvalDate?: string;
      };
      itHeadDesignee?: {
         name?: string;
         signature?: string;
         approvalDate?: string;
      };
      dpoDesignee?: {
         name?: string;
         signature?: string;
         approvalDate?: string;
      };
   };
   forITDepartmentUseOnly?: {
      activeDirectoryAccountDeactivationDate?: string;
      activeDirectoryAccountDeletionDate?: string;
      comments?: string;
      executedBy?: {
         printedName?: string;
         signature?: string;
         date?: string;
      }[];
   };
}

export interface IUserInformationUAM
{
   users?: {
      remark?: string;
      actionType?: string;
      firstName?: string;
      lastName?: string;
      department?: string;
      location?: string;
      email?: string;
   }[];
   dateOfRequest?: string;
   dateOfJoiningLeaving?: string;
   userLocation?: string;
   typeOfAccessRequired?: TypeOfAccessRequiredUAM;
   ifTemporaryDateForDeactivation?: string;
   typeOfUser?: TypeOfUserUAM;
   typeOfUserOtherText?: string;
   designation?: string;
   department?: string;
   networkServicesToBeGrantedRevoked?: {
      emailAccess?: boolean;
      serverAccess?: boolean;
      "sharedDrive/folderAccess"?: boolean;
      APCERNetworkVPNAccess?: boolean;
      others?: boolean;
   };
   reportingManager?: string;
   accessToDistributionList?: boolean;
   comments?: string;
}
export enum TypeOfUserUAM
{
   "ApcerUser" = "ApcerUser",
   "ApcerClientEmp" = "ApcerClientEmp",
   "Other" = "Other",
}

export enum TypeOfAccessRequiredUAM
{
   "permanent" = "permanent",
   "temporary" = "temporary",
}
export enum RequestTypeActionUAM
{
   "Create" = "Create",
   "Modify" = "Modify",
   "Delete" = "Delete",
   "Deactivate" = "Deactivate",
}
export enum AccessRightsUAM
{
   "ReadOnly" = "ReadOnly",
   "ReadWrite" = "ReadWrite",
}
export enum GrantRevokeUAM
{
   "Grant" = "Grant",
   "Revoke" = "Revoke",
}
export enum UserSystemDataUAM
{
   "NotRequired" = "NotRequired",
   "Archive" = "Archive",
   "Handover" = "Handover",
}
