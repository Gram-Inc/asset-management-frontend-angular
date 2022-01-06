import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";
import { SideNavService } from "src/app/core/side-nav/side-nav.service";
import { UamService } from "src/app/core/uam/uam.service";
import {
  AccessRightsUAM,
  GrantRevokeUAM,
  IUAM,
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
  encapsulation: ViewEncapsulation.None,
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

  // UAM Detal page open
  selectedUAM: IUAM;
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
    private _changeDetectorRef: ChangeDetectorRef
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
      uamNo: [""],
      requestTypeAction: [RequestTypeActionUAM.Delete, [Validators.required]],
      userInformation: this.createUserInformationForm(),
      accessToShareDrives: this._formBuilder.array([this.createAccessShareDrive()]),
      userSystemDataAndEmailIdTreatment: this.createUserSystemDataAndEmailIdTreatment(),
      uamApprovals: this.createUAMApprovals(),
      forITDepartmentUseOnly: this.createITDepartmentUseOnly(),
    });

    this._uamService.uam$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (val) => {
        if (val) {
          this.selectedUAM = val;
          this.uamForm.patchValue(val);
          this.uamForm.disable();
          // Mark for check
          this._changeDetectorRef.markForCheck();
        }
      },
      (err) => {
        console.log(err.message);
      }
    );
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
    if (this.uamForm.invalid) return;

    let obj = { ...this.uamForm.value };
    obj.userInformation.reportingManager = obj.userInformation.reportingManager._id;
    this._uamService.createUAM(obj).subscribe(
      (_) => {
        this.openSnackBar("Success", "U.A.M Created");
        this._router.navigate(["../"], {
          relativeTo: this._activatedRoute,
        });
      },
      (err) => {
        console.log(err);
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
