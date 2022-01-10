import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { debounceTime, map, startWith, switchMap, takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";
import { IWarranty } from "src/app/core/asset/asset.types";
import { AutoCompleteService } from "src/app/core/auto-complete/auto-complete.service";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { IDTO } from "src/app/core/dto/dto.types";
import { VendorService } from "src/app/core/vendor/vendor.service";
import { IVendor } from "src/app/core/vendor/vendor.types";

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
export class AssetDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  assetForm: FormGroup;
  categories: string[] = ["Hardware", "Software"]; // Hardware / Software
  types; // All type of asset Types

  //Vendors
  vendors$: Observable<IVendor[]> = new Observable<IVendor[]>();
  //Branchs
  branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();

  //Auto Complete

  filteredModelNameForAutoComplete: Observable<string[]>;

  filteredOSForAutoComplete: Observable<string[]>;

  filteredProcessorForAutoComplete: Observable<string[]>;

  //Constructor
  constructor(
    private _formBuilder: FormBuilder,
    private _assetService: AssetService,
    private _vendorService: VendorService,
    private _branchService: BranchService,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _autoCompleteService: AutoCompleteService
  ) {}

  // Life Cycle Hooks

  ngOnInit(): void {
    // Get All Category & Types
    this._assetService.assetTypes$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.types = val.commonAssetFields.find((x) => x.fieldName == "type").values;
    });

    // Get All Vendors
    this.vendors$ = this._vendorService.vendors$;

    //Get All Branch
    this.branchs$ = this._branchService.branchs$;

    //create Asset Form
    this.assetForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      assetCode: [""],
      type: ["laptop", [Validators.required]], // Set the Value as its KEYVALUE PAIR
      sr_no: ["", [Validators.required]],
      vendorId: [null],
      category: ["", [Validators.required]],
      warranty: [[]],
      branch: [null],
    });

    //Check for AssetTypeChanges
    this.addAssetTypeToAssetForm();

    //Enable AutoCompelete Feature for Model Name
    // this.filteredModelNameForAutoComplete = this.assetForm.get("name").valueChanges.pipe(
    //   startWith(""),
    //   map((value) => this._filterModelName(value))
    // );

    this.assetForm
      .get("name")
      .valueChanges.pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          return this._autoCompleteService.getModelNames(1, 10, query);
        }),
        map(() => {})
      )
      .subscribe();

    this.filteredModelNameForAutoComplete = this._autoCompleteService.modelNames;

    this.assetForm.patchValue({
      name: "Dell ",
      assetCode: "AST01",
      type: "laptop",
      sr_no: "SR",
      vendorId: "61d8699cd8b20d468de4808e",
      category: "Hardware",
      warranty: [
        {
          endAt: [],
        },
      ],
      branch: "61dbf5b5810af6c2dc897a93",
      laptop: {
        system: {
          manufacturer: "",
          model: "",
          serial: "",
        },
        os: {
          platform: "WINDOWS",
          distro: "Windwos 10",
          arch: "x64",
          hostname: "HST01",
        },
        mem: {
          total: 8,
        },
        cpu: {
          manufacturer: "Intel®",
          brand: "i5",
          processors: 1,
        },
        diskLayout: [
          {
            device: "disk0",
            type: "SSD",
            name: "",
            vendor: "",
            size: 128,
          },
        ],
      },
    });
  }
  //On Destroy
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //Check any other Exisiting Field and replace with Selected One
  addAssetTypeToAssetForm() {
    //Validate Type of Dropdown
    if (this.assetForm.controls["type"].invalid) return;
    // Get Type Feilds to be added
    let type = this.assetForm.controls["type"].value;

    //Remove if any other exisiting Field type exsist
    this.removeTypeFromForm();

    let fields: FormGroup = new FormGroup({});
    switch (type) {
      //Laptop, Server ,PC Fields
      case "laptop" || "pc" || "server":
        fields = this._formBuilder.group({
          system: this._formBuilder.group({
            manufacturer: [""],
            model: [""],
            serial: [""],
          }),
          os: this._formBuilder.group({
            platform: ["WINDOWS"],
            distro: [""],
            arch: ["x64"], //x64,x32
            hostname: ["", Validators.required],
          }),
          mem: this._formBuilder.group({
            total: ["", [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]], //in bytes
          }),
          cpu: this._formBuilder.group({
            manufacturer: ["Intel®"],
            brand: [""], //i3,i5..
            processors: 1,
          }),
          diskLayout: this._formBuilder.group({
            device: ["disk0"],
            type: [""], // NVMe,..
            name: [""], //"INTEL SSDPEKNW512G8"
            vendor: [""], // INTEL
            size: [0, [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]],
          }),
        });
        break;

      //Switch , Firewall
      case "switch" || "firewall":
        fields = this._formBuilder.group({
          brand: ["", Validators.required],
          noOfPorts: ["", Validators.required],
          speed: ["", Validators.required],
          modelNo: ["", Validators.required],
        });
        break;

      default:
        break;
    }
    this.assetForm.addControl(type, fields);
    if (type == "laptop") {
      //Enable AutoCompelete Feature

      (this.assetForm.get("laptop") as FormGroup)
        .get("os.distro")
        .valueChanges.pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(300),
          switchMap((query) => {
            return this._autoCompleteService.getOSs(1, 10, query);
          }),
          map(() => {})
        )
        .subscribe();
      this.filteredOSForAutoComplete = this._autoCompleteService.os;

      (this.assetForm.get("laptop") as FormGroup)
        .get("cpu.brand")
        .valueChanges.pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(300),
          switchMap((query) => {
            return this._autoCompleteService.getProcessors(1, 10, query);
          }),
          map(() => {})
        )
        .subscribe();
      this.filteredProcessorForAutoComplete = this._autoCompleteService.processors;
    }
  }

  //Create Asset
  create() {
    this.assetForm.markAllAsTouched();
    //Check Validation
    if (this.assetForm.invalid) return;

    //Create Asset Object chane warranty !!!
    let obj = { ...this.assetForm.value };
    let wrnty: IWarranty = {
      endAt: obj.warranty,
    };
    obj.warranty = [{ ...wrnty }];
    obj.laptop.diskLayout = [{ ...obj.laptop.diskLayout }];

    // Create Asset
    this._assetService.createAsset(obj).subscribe(
      (_) => {
        this.openSnackBar("Success", "Asset Created");
        this._router.navigate(["../"], { relativeTo: this._activatedRoute });
      },
      (err) => {
        let e: IDTO = err.error;
        console.log(err.error);
        this.openSnackBar("Error", e.message);
      }
    );
  }

  removeTypeFromForm() {
    for (const [key, value] of Object.entries(this.types)) {
      if (this.assetForm.contains(value as string)) this.assetForm.removeControl(value as string);
    }
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
