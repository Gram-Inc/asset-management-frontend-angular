import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { debounceTime, filter, map, switchMap, take, takeUntil } from "rxjs/operators";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
    selector: "app-details",
    templateUrl: "./details.component.html",
    styles: [
        /* language=SCSS */
        `
      .fuse-confirmation-dialog-panel {
        .mat-dialog-container {
          padding: 0 !important;
        }
      }
      .mat-form-field-appearance-outline .mat-form-field-wrapper{
          margin : 0px !important;
      }
      .mat-form-field-wrapper{
          padding:0px !important;
      }
    `,
    ],
})
export class DetailsComponent implements OnInit, OnDestroy
{

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    users: IUser[] = [];

    userForm: FormGroup;

    user: IUser;

    //Branchs
    branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();

    //Department
    departments$: Observable<IDepartment[]> = new Observable<IDepartment[]>();
    searchCtrl: FormControl = new FormControl("", [Validators.required]);

    //permission
    //Features
    features = ModuleTypes;
    accessTypes = AccessType;

    assetCtrl
    //Constructor
    constructor(
        private _formBuilder: FormBuilder,
        private _userService: UserService,
        private _branchService: BranchService,
        private _departmentService: DepartmentService,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        public permissionService: PermissionService,
        private _changeDetectorRef: ChangeDetectorRef
    )
    {

    }

    // Life Cycle Hooks

    ngOnInit(): void
    {
        //Get All Branch
        this.branchs$ = this._branchService.branchs$.pipe(takeUntil(this._unsubscribeAll));

        //Get All Departments
        this.departments$ = this._departmentService.departments$.pipe(takeUntil(this._unsubscribeAll));

        //Get All Users
        this._userService.users$.pipe(takeUntil(this._unsubscribeAll)).subscribe((users) =>
        {
            this.users = users;
        });

        this.searchCtrl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) =>
                {
                    return this._userService.getUsers(1, 10, query);
                }),
                map(() => { })
            )
            .subscribe();
        //create User Form
        this.userForm = this._formBuilder.group({
            firstName: ["", [Validators.required]],
            lastName: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            mobileNumber: [
                "",
                [
                    Validators.required,
                    Validators.minLength(10),
                    Validators.maxLength(10),
                    Validators.pattern("^[0-9]*$"),
                ],
            ],
            branch: ["", [Validators.required]], //ID
            departmentId: ["", [Validators.required]], //ID
            role: ["level1", [Validators.required]],
            manager: ["", [Validators.required]],
            permissions: [this.permissionService.permssions,]
        });

        //Check for Edit
        this._userService.selectedUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
        {
            if (!val) return;
            this.userForm.patchValue(val);
            // Patch Value of Deparment
            this.userForm.get('departmentId').setValue(typeof val.departmentId == "object" ? val.departmentId._id : val.departmentId)
            this.userForm.get('branch').setValue(typeof val.branch == "object" ? val.branch._id : val.branch)
            // this.userForm.get('manager').setValue(this._use)
            this.user = val;
        });

        //Check For Changes in Policy / Permission
        this.userForm.get('role').valueChanges.subscribe((val) =>
        {
            if (val == 'level1') { this.userForm.get('permissions').setValue(this.permissionService.permssions); }
            if (val == 'level2')

                this.userForm.get('permissions').setValue([]);

            if (val == 'level3')

                this.userForm.get('permissions').setValue([]);


            this._changeDetectorRef.detectChanges();

        })
    }
    //On Destroy
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    //Create User
    create()
    {
        this.userForm.markAllAsTouched();
        //Check Validation
        if (this.userForm.invalid) return;

        let obj = { ...this.userForm.value };
        obj.manager = obj.manager._id;

        //Update
        if (this.user)
            this._userService.updateUser(this.user._id, obj).subscribe(
                (_) =>
                {
                    console.log("Updated")
                    this.openSnackBar("Success", "User Updated");
                    this._router.navigate(["../../"]
                        , {
                            relativeTo: this._activatedRoute,
                        }
                    );
                },
                (err) =>
                {
                    console.log("Err")
                    this.openSnackBar("Error", err.message);
                }
            );
        //Create
        else
            this._userService.createUser(obj).subscribe(
                (_) =>
                {
                    this.openSnackBar("Success", "User Created");
                    this._router.navigate(["../"], { relativeTo: this._activatedRoute });
                },
                (err) =>
                {
                    this.openSnackBar("Error", err.message);
                }
            );
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
    displayFn(userId)
    {
        let x = this.users.find(usr => usr._id == userId);
        return x?.firstName ?? '';
    }

    compareFn(c1, c2): boolean
    {
        return c1 && c2 ? c1._id == c2._id : c1 == c2;
    }
    getAccessPolicy(module)
    {
        return this.permissionService.checkPermission(this.userForm.get('permissions').value, module)

    }

    setAccessType(accessType, module)
    {
        // Remove Existing Access
        let x = (this.userForm.get('permissions').value as string[]).filter(x => !(x.toUpperCase().includes(module)))

        //Set Selected Acess
        this.userForm.get('permissions').setValue([...x, ...this.permissionService.getArrOfPolicyByAccessType(module, accessType)]);

    }

}
