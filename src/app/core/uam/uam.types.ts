export interface IUAM {
  _id?: string;
  requestTypeAction: "Create" | "Modify" | "Delete" | "Deactivate";
  userInformation: {
    users: {
      remark?: string;
      actionType?: string;
      userId?: string;
    }[];
    dateOfRequest: string;
    dateOfJoiningLeaving: string;
    typeOfAccessRequired: "permanent" | "temporary";
    ifTemporaryDateForDeactivation: string;
    typeOfUser: "ApcerUser" | "ApcerClientEmp" | "Other";
    typeOfUserOtherText: string;
    designation: string;
    department: string;
    networkServicesToBeGrantedRevoked: {
      emailAccess: boolean;
      serverAccess: boolean;
      "sharedDrive/folderAccess": boolean;
      APCERNetworkVPNAccess: boolean;
      others: boolean;
    };
    reportingManager: string;
    accessToDistributionList: boolean;
    comments: string;
  };
  accessToShareDrives: {
    driveName: string;
    folderName: string;
    accessRights: "ReadOnly" | "ReadWrite";
    grantRevoke: "Grant" | "Revoke";
  }[];
  userSystemDataAndEmailIdTreatment: {
    userSystemData: "NotRequired" | "Archive" | "Handover";
    dataHandOverTo: string;
    endUserConfirmationOnReceiptOfData: string;
    emailMailboxTransferredTo: string;
    endUserConfirmationOnActivationOfMailbox: string;
    emailIdForwardedTo: string;
    dateTillEmailIdToRemainActive: string;
    endUserConfirmatinoOnEmailForwarding: string;
  };
  uamApprovals: {
    requestedBy: {
      name: string;
      signature: string;
      approvalDate: string;
    };
    headOfDepartmentDesignee: {
      name: string;
      signature: string;
      approvalDate: string;
    };
    itHeadDesignee: {
      name: string;
      signature: string;
      approvalDate: string;
    };
    dpoDesignee: {
      name: string;
      signature: string;
      approvalDate: string;
    };
  };
  forITDepartmentUseOnly: {
    activeDirectoryAccountDeactivationDate: string;
    activeDirectoryAccountDeletionDate: string;
    comments: string;
    executedBy: {
      printedName: string;
      signature: string;
      date: string;
    }[];
  };
}
