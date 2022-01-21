import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { VendorService } from "src/app/core/vendor/vendor.service";
import { IVendor } from "src/app/core/vendor/vendor.types";

@Component({
  selector: "vendor-create",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateComponent implements OnInit, OnDestroy {
  vendorForm: FormGroup;
  vendor: IVendor = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  //Constructor
  constructor(
    private _formBuilder: FormBuilder,
    private _vendorService: VendorService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  // Life Cycle Hooks

  ngOnInit(): void {
    //create Vendor Form
    this.vendorForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      address1: ["", [Validators.required]],
      address2: [""],
      address3: [""],
      contactNo: ["", [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      contactPersonName: [""],
      city: ["", [Validators.required]],
      serviceNo: [""],
    });

    this._vendorService.vendor$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.vendor = val;
      this.vendorForm.patchValue(val);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    if (this.vendor) this._vendorService.clrVendor();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  //Create Vendor
  create() {
    this.vendorForm.markAllAsTouched();
    //Check Validation
    if (this.vendorForm.invalid) return;

    // Create Vendor
    if (this.vendor)
      this._vendorService.updateVendor(this.vendor._id, this.vendorForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Vendor Updated");
          this._router.navigate(["../"], {
            relativeTo: this._activatedRoute,
          });
        },
        (err) => {
          this.openSnackBar("Error", err.message);
        }
      );
    else
      this._vendorService.createVendor(this.vendorForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Vendor Created");
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
