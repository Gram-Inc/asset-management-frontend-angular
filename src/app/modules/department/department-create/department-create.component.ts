import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DepartmentService } from "src/app/core/department/department.service";
import { IDepartment } from "src/app/core/department/department.types";

@Component({
  selector: "app-department-create",
  templateUrl: "./department-create.component.html",
  styleUrls: ["./department-create.component.scss"],
})
export class DepartmentCreateComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  department$: Observable<IDepartment>;

  departmentForm: UntypedFormGroup;

  department: IDepartment = null;

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _departmentService: DepartmentService,
    private _formBuilder: UntypedFormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.departmentForm = this._formBuilder.group({
      _id: [""],
      name: ["", Validators.required],
    });

    this._departmentService.department$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.department = val;
      this.departmentForm.patchValue(val);

      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  create() {
    this.departmentForm.markAllAsTouched();

    if (this.departmentForm.invalid) return;

    if (this.department)
      this._departmentService.updateDepartment(this.department._id, this.departmentForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Department Updated");
          this._router.navigate(["../"], {
            relativeTo: this._activatedRoute,
          });
        },
        (err) => {
          this.openSnackBar("Error", err.message);
        }
      );
    else
      this._departmentService.createDepartment(this.departmentForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Department Created");
          this._router.navigate(["../"], {
            relativeTo: this._activatedRoute,
          });
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

