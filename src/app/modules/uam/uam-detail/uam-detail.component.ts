import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
    private _activatedRoute: ActivatedRoute,
    private _sideNavService: SideNavService
  ) {}

  ngOnInit(): void {
    //Close side Nav
    this._sideNavService.opened = false;
    //Get All Branch
    this.branchs$ = this._branchService.branchs$;

    //Get All User
    this.users$ = this._userService.users$;

    //Get All Department
    this.departments$ = this._departmentService.departments$;

    // Create UAM Form
    this.uamForm = this._formBuilder.group({
      _id: [""],
      requestTypeAction: [RequestTypeActionUAM.Create, [Validators.required]],
      userInformation: this.createUserInformationForm(),
      accessToShareDrives: this._formBuilder.array([this.createAccessShareDrive()]),
      userSystemDataAndEmailIdTreatment: this.createUserSystemDataAndEmailIdTreatment(),
      uamApprovals: this.createUAMApprovals(),
      forITDepartmentUseOnly: this.createITDepartmentUseOnly(),
    });
  }
  //On Destroy
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  createUserInformationForm(): FormGroup {
    return this._formBuilder.group({
      users: this._formBuilder.array([this.createUser()]),
      dateOfRequest: [new Date(Date.now())],
      dateOfJoiningLeaving: [""],
      typeOfAccessRequired: [null],
      userLocation: [""],
      ifTemporaryDateForDeactivation: [""],
      typeOfUser: [null],
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
      userSystemData: [UserSystemDataUAM["Not Required"]],
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
      remark: [""],
      actionType: [""],
      userId: [""],
    });
  }
  addUserToForm(): void {
    let frm = this.uamForm.get("userInformation.users") as FormArray;
    frm.push(this.createUser());
  }
  removeUserFromForm(): void {
    let frm = this.uamForm.get("userInformation.users") as FormArray;
    if (frm.length >= 0) frm.removeAt(frm.length - 1);
  }

  createAccessShareDrive(): FormGroup {
    return this._formBuilder.group({
      driveName: [""],
      folderName: [""],
      accessRights: [null],
      grantRevoke: [null],
    });
  }
  addAccessToShareDriveForm(): void {
    let frm = this.uamForm.get("accessToShareDrives") as FormArray;
    frm.push(this.createAccessShareDrive());
  }

  removeAccessToShareDriveForm(): void {
    let frm = this.uamForm.get("accessToShareDrives") as FormArray;
    if (frm.length >= 0) frm.removeAt(frm.length - 1);
  }

  generateRequest() {
    this.uamForm.markAllAsTouched();
    //VAlidate Form
    if (this.uamForm.invalid) return;

    this._uamService.createUAM(this.uamForm.value).subscribe(
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
}
