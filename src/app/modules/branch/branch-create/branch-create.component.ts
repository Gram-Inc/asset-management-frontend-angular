import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";

@Component({
  selector: "app-branch-create",
  templateUrl: "./branch-create.component.html",
  styleUrls: ["./branch-create.component.scss"],
})
export class BranchCreateComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  branch$: Observable<IBranch>;

  branchForm: FormGroup;

  branch: IBranch = null;

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _branchService: BranchService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Create Branch Form

    this.branchForm = this._formBuilder.group({
      _id: [""],
      name: ["", Validators.required],
      address1: ["", Validators.required],
      address2: ["", Validators.required],
      address3: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      fqdn: [""],
      branchCode: ["", [Validators.required, Validators.maxLength(4)]],
    });

    this._branchService.branch$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      console.log(val);
      this.branch = val;
      this.branchForm.patchValue(val);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  create() {
    //Validate the Form
    this.branchForm.markAllAsTouched();

    if (this.branchForm.invalid) return;

    //CHECK IF UPDATE or Create

    //Update
    if (this.branch)
      this._branchService.updateBranch(this.branch._id, this.branchForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Branch Updated");
          this._router.navigate(["../"], {
            relativeTo: this._activatedRoute,
          });
        },
        (err) => {
          this.openSnackBar("Error", err.message);
        }
      );
    //Create
    else
      this._branchService.createBranch(this.branchForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Branch Created");
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
