import
{
   AfterViewChecked,
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   OnDestroy,
   OnInit,
   ViewEncapsulation,
} from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDrawer } from "@angular/material/sidenav";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import { debounceTime, take, takeUntil } from "rxjs/operators";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";
import { SideNavService } from "src/app/core/side-nav/side-nav.service";
import { UamService } from "src/app/core/uam/uam.service";
import
{
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
export class UamDetailComponent implements OnInit, OnDestroy
{
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
   uamForm: UntypedFormGroup;

   constructor(
      private _userService: UserService,
      private _branchService: BranchService,
      private _departmentService: DepartmentService,
      private _uamService: UamService,
      private _formBuilder: UntypedFormBuilder,
      private _snackBar: MatSnackBar,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _changeDetectorRef: ChangeDetectorRef
   ) { }

   ngOnInit(): void
   {
      //Get All Branch
      this.branchs$ = this._branchService.branchs$;

      //Get All User
      this.users$ = this._userService.users$;

      //Get All Department
      this.departments$ = this._departmentService.departments$;

      // Create UAM Form
      this.uamForm = this._formBuilder.group({
         uamNo: [""],
         priority: ['low'],
         uamType: ['windows'],
         requestTypeAction: [RequestTypeActionUAM.Delete, [Validators.required]],
         windows: this._formBuilder.group({
            userInformation: this.createUserInformationForm(),
            accessToShareDrives: this._formBuilder.array([]),
            userSystemDataAndEmailIdTreatment: this.createUserSystemDataAndEmailIdTreatment(),
            uamApprovals: this.createUAMApprovals(),
            forITDepartmentUseOnly: this.createITDepartmentUseOnly(),
         })
      });

      this.uamForm.get('windows.userSystemDataAndEmailIdTreatment').get('userSystemData').valueChanges.subscribe((value: UserSystemDataUAM) =>
      {
         if (value == UserSystemDataUAM.NotRequired)
         {
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.dataHandOverTo').clearValidators();
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.endUserConfirmationOnReceiptOfData').clearValidators();
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.emailMailboxTransferredTo').clearValidators();
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.endUserConfirmationOnActivationOfMailbox').clearValidators();
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.emailIdForwardedTo').clearValidators();
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.dateTillEmailIdToRemainActive').clearValidators();
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.endUserConfirmatinoOnEmailForwarding').clearValidators();
         } else
         {
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.dataHandOverTo').setValidators([Validators.required]);
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.endUserConfirmationOnReceiptOfData').setValidators([Validators.required]);
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.emailMailboxTransferredTo').setValidators([Validators.required]);
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.endUserConfirmationOnActivationOfMailbox').setValidators([Validators.required]);
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.emailIdForwardedTo').setValidators([Validators.required]);
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.dateTillEmailIdToRemainActive').setValidators([Validators.required]);
            this.uamForm.get('windows.userSystemDataAndEmailIdTreatment.endUserConfirmatinoOnEmailForwarding').setValidators([Validators.required]);
         }

         Object.keys(this.uamForm.get('windows.userSystemDataAndEmailIdTreatment')['controls']).forEach(field =>
         {
            let control = this.uamForm.get('windows.userSystemDataAndEmailIdTreatment').get(field);
            control.updateValueAndValidity({ emitEvent: false });
         });
      })

      //Date of DeActivation Validator
      this.uamForm.get('windows.userInformation.typeOfAccessRequired').valueChanges.subscribe((value: TypeOfAccessRequiredUAM) =>
      {
         if (value == TypeOfAccessRequiredUAM.permanent)
            this.uamForm.get('windows.userInformation.ifTemporaryDateForDeactivation').clearValidators();
         else
            this.uamForm.get('windows.userInformation.ifTemporaryDateForDeactivation').setValidators([Validators.required]);

         this.uamForm.get('windows.userInformation.ifTemporaryDateForDeactivation').updateValueAndValidity({ emitEvent: false });
      })

      this._uamService.uam$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
         (val) =>
         {
            if (val)
            {
               this.selectedUAM = val;
               this.uamForm.patchValue(val);
               this.uamForm.disable();
               // Mark for check
               this._changeDetectorRef.markForCheck();
            }
         },
         (err) =>
         {
            throwError(err);
         }
      );
   }
   //On Destroy
   ngOnDestroy(): void
   {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }
   createUserInformationForm(): UntypedFormGroup
   {
      return this._formBuilder.group({
         users: this._formBuilder.array([this.createUser()], [Validators.required]),
         dateOfRequest: [new Date(Date.now()), Validators.required],
         dateOfJoiningLeaving: [new Date(Date.now()), Validators.required],
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
   createITDepartmentUseOnly()
   {
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
   createUserSystemDataAndEmailIdTreatment()
   {
      return this._formBuilder.group({
         userSystemData: [UserSystemDataUAM.Handover],
         dataHandOverTo: ["", [Validators.required]],
         endUserConfirmationOnReceiptOfData: ["", [Validators.required]],
         emailMailboxTransferredTo: ["", [Validators.required]],
         endUserConfirmationOnActivationOfMailbox: ["", [Validators.required]],
         emailIdForwardedTo: ["", [Validators.required]],
         dateTillEmailIdToRemainActive: ["", [Validators.required]],
         endUserConfirmatinoOnEmailForwarding: ["", [Validators.required]],
      });
   }
   createUAMApprovals(): UntypedFormGroup
   {
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
   createUser(): UntypedFormGroup
   {
      return this._formBuilder.group({
         firstName: ["", [Validators.required]],
         lastName: ["", [Validators.required]],
         department: ["", [Validators.required]],
         location: ["", [Validators.required]],
         designation: ["", [Validators.required]],
         email: ["", [Validators.required]],
         remark: [""],
         actionType: ["",], //@Gramosx
      });
   }
   addUserToForm(): void
   {
      let frm = this.uamForm.get("userInformation.users") as UntypedFormArray;
      frm.push(this.createUser());
   }
   removeUserFromForm(index: number): void
   {
      let frm = this.uamForm.get("userInformation.users") as UntypedFormArray;
      if (frm.length >= 0) frm.removeAt(index);
   }
   createAccessShareDrive(): UntypedFormGroup
   {
      return this._formBuilder.group({
         driveName: ["", [Validators.required]],
         folderName: ["", [Validators.required]],
         accessRights: [AccessRightsUAM.ReadOnly],
         grantRevoke: [GrantRevokeUAM.Revoke],
      });
   }
   addAccessToShareDriveForm(): void
   {
      let frm = this.uamForm.get("accessToShareDrives") as UntypedFormArray;
      frm.push(this.createAccessShareDrive());
   }
   removeAccessToShareDriveForm(): void
   {
      let frm = this.uamForm.get("accessToShareDrives") as UntypedFormArray;
      if (frm.length > 0) frm.removeAt(frm.length - 1);
   }

   //MAin Function
   generateRequest()
   {
      this.uamForm.markAllAsTouched();

      console.log(this.uamForm)
      //VAlidate Form
      if (this.uamForm.invalid) return;

      let obj = { ...this.uamForm.value };
      obj.windows.userInformation.reportingManager = obj.windows.userInformation.reportingManager._id;
      this._uamService.createUAM(obj).subscribe(
         (_) =>
         {
            this.openSnackBar("Success", "U.A.M Created");
            this._router.navigate(["../"], {
               relativeTo: this._activatedRoute,
            });
         },
         (err) =>
         {
            console.log(err)
            this.openSnackBar("Error", err.message);
         }
      );
   }

   ToArray(enumme)
   {
      return Object.keys(enumme).map((key) => enumme[key]);
   }

   openSnackBar(type: "Error" | "Info" | "Success", msg: string)
   {
      this._snackBar.open(msg, "Close", {
         duration: 3000,
         verticalPosition: "top",
         horizontalPosition: "center",
         panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
      });
   }

   displayFnUser(user: IUser): string
   {
      return user && user.firstName ? user.firstName + " " + user.lastName : "";
   }
}
