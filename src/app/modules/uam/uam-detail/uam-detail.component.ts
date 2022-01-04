import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import {
  AccessRightsUAM,
  GrantRevokeUAM,
  RequestTypeActionUAM,
  TypeOfAccessRequiredUAM,
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

  // User
  users$: Observable<IUser[]> = new Observable<IUser[]>();
  //Branchs
  branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();

  uamForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _branchService: BranchService,
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

    // Create UAM Form
    this.uamForm = this._formBuilder.group({
      _id: [""],
      requestTypeAction: [RequestTypeActionUAM.Create, [Validators.required]],
      accessToShareDrives: this._formBuilder.array([this.createAccessShareDrive()]),
      userInformation: this.createUserInformationForm(),
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
      dateOfRequest: [Date.now()],
      dateOfJoiningLeaving: [""],
      typeOfAccessRequired: [null],
      ifTemporaryDateForDeactivation: [""],
      typeOfUser: [null],
      typeOfUserOtherText: [""],
      designation: [""],
      department: [""],
      networkServicesToBeGrantedRevoked: {
        emailAccess: [false],
        serverAccess: [false],
        "sharedDrive/folderAccess": [false],
        APCERNetworkVPNAccess: [false],
        others: [false],
      },
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
        {
          printedName: [""],
          signature: [""],
          date: [""],
        },
      ]),
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
    console.log(this.uamForm.value);
  }

  ToArray(enumme) {
    return Object.keys(enumme).map((key) => enumme[key]);
  }
}
