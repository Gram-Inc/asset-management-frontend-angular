import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";
import { SideNavService } from "src/app/core/side-nav/side-nav.service";
import { UamService } from "src/app/core/uam/uam.service";
import {
  AccessRightsUAM,
  GrantRevokeUAM,
  RequestTypeActionUAM,
  TypeOfAccessRequiredUAM,
  TypeOfUserUAM,
  UserSystemDataUAM,
} from "src/app/core/uam/uam.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-uam-detail",
  templateUrl: "./uam-detail.component.html",
  styleUrls: ["./uam-detail.component.scss"],
})
export class UamDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  requestType: RequestTypeActionUAM = RequestTypeActionUAM.Create;
  requestTypes = RequestTypeActionUAM;
  TypeOfAccessRequiredUAM = TypeOfAccessRequiredUAM;
  noOfUser: "single" | "multiple" = "single";
  typeOfUser = TypeOfUserUAM;
  accessRight = AccessRightsUAM;
  grantRevoke = GrantRevokeUAM;
  userSystemData = UserSystemDataUAM;
  // User
  users$: Observable<IUser[]> = new Observable<IUser[]>();
  //Branchs
  branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();
  //Department
  departments$: Observable<IDepartment[]> = new Observable<IDepartment[]>();

  uamForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _uamService: UamService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Get All Branch
    this.branchs$ = this._branchService.branchs$;

    //Get All User
    this.users$ = this._userService.users$;

    //Get All Department
    this.departments$ = this._departmentService.departments$;

    // Create UAM Form
    this.uamForm = this._formBuilder.group({
      _id: [""],
      requestTypeAction: [RequestTypeActionUAM.Delete, [Validators.required]],
      userInformation: this.createUserInformationForm(),
      accessToShareDrives: this._formBuilder.array([this.createAccessShareDrive()]),
      userSystemDataAndEmailIdTreatment: this.createUserSystemDataAndEmailIdTreatment(),
      uamApprovals: this.createUAMApprovals(),
      forITDepartmentUseOnly: this.createITDepartmentUseOnly(),
    });

    this.uamForm.patchValue(this.dummy);
  }
  //On Destroy
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createUserInformationForm(): FormGroup {
    return this._formBuilder.group({
      users: this._formBuilder.array([this.createUser()], [Validators.required]),
      dateOfRequest: [new Date(Date.now())],
      dateOfJoiningLeaving: [""],
      typeOfAccessRequired: [TypeOfAccessRequiredUAM.permanent],
      userLocation: [""],
      ifTemporaryDateForDeactivation: [""],
      typeOfUser: [TypeOfUserUAM.ApcerUser],
      typeOfUserOtherText: [""],
      designation: [""],
      department: [""],
      networkServicesToBeGrantedRevoked: this._formBuilder.group({
        emailAccess: [false],
        serverAccess: [false],
        "sharedDrive/folderAccess": [false],
        APCERNetworkVPNAccess: [false],
        others: [false],
      }),
      reportingManager: [""],
      accessToDistributionList: [false],
      comments: [""],
    });
  }
  createITDepartmentUseOnly() {
    return this._formBuilder.group({
      activeDirectoryAccountDeactivationDate: [""],
      activeDirectoryAccountDeletionDate: [""],
      comments: [""],
      executedBy: this._formBuilder.array([
        this._formBuilder.group({
          printedName: [""],
          signature: [""],
          date: [""],
        }),
      ]),
    });
  }

  createUserSystemDataAndEmailIdTreatment() {
    return this._formBuilder.group({
      userSystemData: [UserSystemDataUAM.Handover],
      dataHandOverTo: [""],
      endUserConfirmationOnReceiptOfData: [""],
      emailMailboxTransferredTo: [""],
      endUserConfirmationOnActivationOfMailbox: [""],
      emailIdForwardedTo: [""],
      dateTillEmailIdToRemainActive: [""],
      endUserConfirmatinoOnEmailForwarding: [""],
    });
  }
  createUAMApprovals(): FormGroup {
    let obj = {
      name: [""],
      signature: [""],
      approvalDate: [""],
    };
    return this._formBuilder.group({
      requestedBy: this._formBuilder.group(obj),
      headOfDepartmentDesignee: this._formBuilder.group(obj),
      itHeadDesignee: this._formBuilder.group(obj),
      dpoDesignee: this._formBuilder.group(obj),
    });
  }
  createUser(): FormGroup {
    return this._formBuilder.group({
      firstName: [""],
      lastName: [""],
      department: [""],
      location: [""],
      designation: [""],
      email: [""],
      remark: [""],
      actionType: [""],
    });
  }
  addUserToForm(): void {
    let frm = this.uamForm.get("userInformation.users") as FormArray;
    frm.push(this.createUser());
  }
  removeUserFromForm(index: number): void {
    let frm = this.uamForm.get("userInformation.users") as FormArray;
    if (frm.length >= 0) frm.removeAt(index);
  }
  createAccessShareDrive(): FormGroup {
    return this._formBuilder.group({
      driveName: [""],
      folderName: [""],
      accessRights: [AccessRightsUAM.ReadOnly],
      grantRevoke: [GrantRevokeUAM.Revoke],
    });
  }
  addAccessToShareDriveForm(): void {
    let frm = this.uamForm.get("accessToShareDrives") as FormArray;
    frm.push(this.createAccessShareDrive());
  }
  removeAccessToShareDriveForm(): void {
    let frm = this.uamForm.get("accessToShareDrives") as FormArray;
    if (frm.length > 0) frm.removeAt(frm.length - 1);
  }

  //MAin Function
  generateRequest() {
    this.uamForm.markAllAsTouched();
    //VAlidate Form
    console.log(this.uamForm.value);
    if (this.uamForm.invalid) return;
    let obj = { ...this.uamForm.value };
    console.log(obj);
    obj.reportingManager = obj.reportingManager._id;
    console.log(obj);
    this._uamService.createUAM(obj).subscribe(
      (_) => {
        this.openSnackBar("Success", "U.A.M Created");
        this._router.navigate(["../"], {
          relativeTo: this._activatedRoute,
        });
      },
      (err) => {
        this.openSnackBar("Error", err.message);
      }
    );
  }

  ToArray(enumme) {
    return Object.keys(enumme).map((key) => enumme[key]);
  }

  openSnackBar(type: "Error" | "Info" | "Success", msg: string) {
    this._snackBar.open(msg, "Close", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
    });
  }

  displayFnUser(user: IUser): string {
    return user && user.firstName ? user.firstName + " " + user.lastName : "";
  }

  dummy = {
    _id: "",
    requestTypeAction: "Delete",
    userInformation: {
      users: [
        {
          firstName: "First",
          lastName: "last",
          department: "depart",
          location: "locaion",
          designation: "desgination",
          email: "email@email.com",
          remark: "Remark",
          actionType: "Accesss type",
        },
      ],
      dateOfRequest: "2022-01-06T07:34:20.889Z",
      dateOfJoiningLeaving: "2022-01-24T18:30:00.000Z",
      typeOfAccessRequired: "temporary",
      userLocation: "IT",
      ifTemporaryDateForDeactivation: "2022-01-25T18:30:00.000Z",
      typeOfUser: "ApcerUser",
      typeOfUserOtherText: "",
      designation: "",
      department: "Designation",
      networkServicesToBeGrantedRevoked: {
        emailAccess: false,
        serverAccess: true,
        "sharedDrive/folderAccess": true,
        APCERNetworkVPNAccess: false,
        others: false,
      },
      reportingManager: {
        _id: "61d2b13ac142d96ac3c9398f",
        branch: "61c1452200abe3f6e11582c7",
        allocatedAssets: ["61d28a6bc142d96ac3c938b3"],
        departmentId: "61a202012e4001e57ca6f2cb",
        isActive: true,
        role: "level2",
        email: "govinddddddd@gmail.com",
        lastName: "Solanki",
        firstName: "Govind",
        __v: 0,
        createdAt: "2022-01-03T08:18:02.649Z",
        updatedAt: "2022-01-05T12:04:46.374Z",
      },
      accessToDistributionList: false,
      comments: "Test",
    },
    accessToShareDrives: [
      {
        driveName: "Drive",
        folderName: "Folder",
        accessRights: "ReadOnly",
        grantRevoke: "Revoke",
      },
    ],
    userSystemDataAndEmailIdTreatment: {
      userSystemData: "Handover",
      dataHandOverTo: "Handover",
      endUserConfirmationOnReceiptOfData: "Receipt",
      emailMailboxTransferredTo: "Mailbox",
      endUserConfirmationOnActivationOfMailbox: "activvation",
      emailIdForwardedTo: "forwarded",
      dateTillEmailIdToRemainActive: "2022-01-20T18:30:00.000Z",
      endUserConfirmatinoOnEmailForwarding: "email for",
    },
    uamApprovals: {
      requestedBy: {
        name: "Requested",
        signature: "",
        approvalDate: "",
      },
      headOfDepartmentDesignee: {
        name: "HOD",
        signature: "",
        approvalDate: "",
      },
      itHeadDesignee: {
        name: "IT Hear",
        signature: "",
        approvalDate: "",
      },
      dpoDesignee: {
        name: "DPO",
        signature: "",
        approvalDate: "",
      },
    },
    forITDepartmentUseOnly: {
      activeDirectoryAccountDeactivationDate: "2022-01-24T18:30:00.000Z",
      activeDirectoryAccountDeletionDate: "2022-01-18T18:30:00.000Z",
      comments: "Comment",
      executedBy: [
        {
          printedName: "Executed",
          signature: "",
          date: "",
        },
      ],
    },
  };
}
