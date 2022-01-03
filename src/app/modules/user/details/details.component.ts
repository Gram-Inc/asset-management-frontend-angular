import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";
import { UserService } from "src/app/core/user/user.service";

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
    `,
  ],
})
export class DetailsComponent implements OnInit {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  userForm: FormGroup;

  //Branchs
  branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();
  //Department
  departments$: Observable<IDepartment[]> = new Observable<IDepartment[]>();

  //Constructor
  constructor(
    private _formBuilder: FormBuilder,
    private _userService: UserService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  // Life Cycle Hooks

  ngOnInit(): void {
    //Get All Branch
    this.branchs$ = this._branchService.branchs$;
    //Get All Departments
    this.departments$ = this._departmentService.departments$;

    //create User Form
    this.userForm = this._formBuilder.group({
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      mobileNumber: ["", [Validators.required]],
      branch: ["", [Validators.required]], //ID
      departmentId: ["", [Validators.required]], //ID
      role: ["", [Validators.required]],
    });
  }
  //On Destroy
  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  //Create User
  create() {
    this.userForm.markAllAsTouched();
    //Check Validation
    if (this.userForm.invalid) return;

    // Create User
    this._userService.createUser(this.userForm.value).subscribe(
      (_) => {
        this.openSnackBar("Success", "User Created");
        this._router.navigate(["../"], { relativeTo: this._activatedRoute });
      },
      (err) => {
        this.openSnackBar("Error", err.message);
      }
    );
  }

  openSnackBar(type: "Error" | "Info" | "Success", msg: string) {
    this._snackBar.open(msg, "Close", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
    });
  }
}
