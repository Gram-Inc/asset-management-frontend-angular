export interface IUAM {
  _id?: string;
  requestTypeAction?: RequestTypeActionUAM;
  userInformation?: {
    users?: {
      remark?: string;
      actionType?: string;
      userId?: string;
    }[];
    dateOfRequest?: string;
    dateOfJoiningLeaving?: string;
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
  };
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
export enum TypeOfUserUAM {
  "ApcerUser",
  "ApcerClientEmp",
  "Other",
}
export enum TypeOfAccessRequiredUAM {
  "permanent",
  "temporary",
}
export enum RequestTypeActionUAM {
  "Create",
  "Modify",
  "Delete",
  "Deactivate",
}
export enum AccessRightsUAM {
  "ReadOnly",
  "ReadWrite",
}
export enum GrantRevokeUAM {
  "Grant",
  "Revoke",
}
export enum UserSystemDataUAM {
  "NotRequired",
  "Archive",
  "Handover",
}
