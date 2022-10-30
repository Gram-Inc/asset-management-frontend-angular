import { STEPPER_GLOBAL_OPTIONS } from "@angular/cdk/stepper";
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormArray, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { debounceTime, map, startWith, switchMap, takeUntil } from "rxjs/operators";
import { AssetForm } from "src/app/core/asset/asset-form";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset, IWarranty } from "src/app/core/asset/asset.types";
import { AutoCompleteService } from "src/app/core/auto-complete/auto-complete.service";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { IDTO } from "src/app/core/dto/dto.types";
import { VendorService } from "src/app/core/vendor/vendor.service";
import { IVendor } from "src/app/core/vendor/vendor.types";

@Component({
   selector: "app-create-asset",
   templateUrl: "./create-asset.component.html",
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
   providers: [
      {
         provide: STEPPER_GLOBAL_OPTIONS,
         useValue: { displayDefaultIndicatorType: false },
      },
   ],
})
export class CreateAssetComponent implements OnInit, OnDestroy
{
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   assetForm: UntypedFormGroup;
   categories: string[] = ["Hardware", "Software"]; // Hardware / Software
   types; // All type of asset Types

   asset: IAsset = null;
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
      private _formBuilder: UntypedFormBuilder,
      private _assetService: AssetService,
      private _vendorService: VendorService,
      private _branchService: BranchService,
      private _snackBar: MatSnackBar,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _autoCompleteService: AutoCompleteService
   ) { }


   get type()
   {
      return this.assetForm.get('type').value
   }
   // Life Cycle Hooks

   ngOnInit(): void
   {
      // Check if path is Create Open As Blanck
      // this._activatedRoute.url.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => { c/onsole.log(this._router.) });
      // Get All Category & Types
      this._assetService.assetTypes$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.types = val.commonAssetFields.find((x) => x.fieldName == "type").values;
      });

      // Get All Vendors
      this.vendors$ = this._vendorService.vendors$;

      //Get All Branch
      this.branchs$ = this._branchService.branchs$;

      //create Asset Form
      this.assetForm = this._formBuilder.group({
         assetCode: [""],
         name: ["", [Validators.required]],
         poNumber: [""],
         sr_no: [""],
         type: ["laptop", [Validators.required]], // Set the Value as its KEYVALUE PAIR
         vendorId: [null],
         category: [null, [Validators.required]],
         warranty: this._formBuilder.array([]),
         branch: [null, [Validators.required]],
      });

      this.assetForm
         .get("type")
         .valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            map(() =>
            {
               return this.addAssetTypeToAssetForm();
            })
         )
         .subscribe();

      this.assetForm
         .valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
         )
         .subscribe(x => console.log(x)
         );
      //Check for AssetTypeChanges
      this.addAssetTypeToAssetForm();

      this._assetService.asset$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val: IAsset) =>
      {
         if (val != null)
         {
            this.assetForm.get("type").setValue(val.type);

            this.asset = val;
            //Set Asset Type to formbuilder
            this.addAssetTypeToAssetForm();
            this.assetForm.patchValue(val);
            this.asset.warranty?.map(x => (this.assetForm.get('warranty') as UntypedFormArray).controls.push(AssetForm.WarrantyForm(x)));
            this.asset.amc?.map(x => (this.assetForm.get('amc') as UntypedFormArray).controls.push(AssetForm.WarrantyForm(x)));
            this.assetForm.get(val.type).patchValue(val[val.type]);
            if (this.asset.type == 'laptop' || this.asset.type == 'server' || this.asset.type == 'pc')
            {
               // (this.assetForm.get(this.asset.type + '.diskLayout') as FormArray).clear()
               this.asset[this.asset.type].diskLayout.map(x =>
               {

                  (this.assetForm.get(this.asset.type + '.diskLayout') as UntypedFormArray).controls.push(AssetForm.DiskFormGroup(x));
               });
            }

            this.assetForm.get("branch").setValue(typeof val.branch == "object" ? val.branch._id : null);
         }
      });
   }
   //On Destroy
   ngOnDestroy(): void
   {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
   }

   //Check any other Exisiting Field and replace with Selected One
   addAssetTypeToAssetForm()
   {
      //Validate Type of Dropdown
      if (this.assetForm.controls["type"].invalid) return;
      // Get Type Feilds to be added
      let type = this.assetForm.controls["type"].value;

      //Remove if any other exisiting Field type exsist
      this.removeTypeFromForm();

      let fields: UntypedFormGroup = new UntypedFormGroup({});
      switch (type)
      {
         //Laptop, Server ,PC Fields
         case 'pc':
         case 'server':
         case "laptop":
            this.assetForm.get('category').setValue('Hardware')
            fields = this._formBuilder.group({
               system: this._formBuilder.group({
                  manufacturer: [""],
                  model: [null, [Validators.required]],
                  serial: [null, [Validators.required]],
               }),
               os: this._formBuilder.group({
                  platform: ["windows"],
                  distro: ["Windows 11"],
                  arch: ["x64"], //x64,x32
                  hostname: ["", Validators.required],
               }),
               mem: this._formBuilder.group({
                  total: [4, [Validators.required, Validators.min(1), Validators.pattern("^([1-9][0-9]*)$")]], //in bytes
               }),
               cpu: this._formBuilder.group({
                  manufacturer: ["Intel®"],
                  brand: [""], //i3,i5..
                  processors: [1, [Validators.min(1), Validators.required, Validators.pattern("^([1-9][0-9]*)$")]],
               }),
               diskLayout: this._formBuilder.array([AssetForm.DiskFormGroup()]),
            });
            break;

         //Switch , Firewall
         case "switch":
         case "firewall":
            this.assetForm.get('category').setValue('Hardware')
            fields = this._formBuilder.group({
               brand: ["", Validators.required],
               noOfPorts: ["", Validators.required],
               speed: ["", Validators.required],
               modelNo: ["", Validators.required],
            });
            break;

         case 'software':
            this.assetForm.get('category').setValue('Software')
            break;
         default:
            break;
      }
      this.assetForm.addControl(type, fields);
      if (type == "laptop" || type == "pc" || type == "server")
      {
         //Enable AutoCompelete Feature
         (this.assetForm.get(`${type}.system`) as UntypedFormGroup)
            .get("model")
            .valueChanges.pipe(
               takeUntil(this._unsubscribeAll),
               debounceTime(300),
               switchMap((query) =>
               {
                  return this._autoCompleteService.getModelNames(1, 10, query);
               }),
               map(() => { })
            )
            .subscribe();

         this.filteredModelNameForAutoComplete = this._autoCompleteService.modelNames;

         (this.assetForm.get(type) as UntypedFormGroup)
            .get("os.distro")
            .valueChanges.pipe(
               takeUntil(this._unsubscribeAll),
               debounceTime(300),
               switchMap((query) =>
               {
                  return this._autoCompleteService.getOSs(1, 10, query);
               }),
               map(() => { })
            )
            .subscribe();
         this.filteredOSForAutoComplete = this._autoCompleteService.os;

         (this.assetForm.get(type) as UntypedFormGroup)
            .get("cpu.brand")
            .valueChanges.pipe(
               takeUntil(this._unsubscribeAll),
               debounceTime(300),
               switchMap((query) =>
               {
                  return this._autoCompleteService.getProcessors(1, 10, query);
               }),
               map(() => { })
            )
            .subscribe();
         this.filteredProcessorForAutoComplete = this._autoCompleteService.processors;
      }
   }

   //Create Asset
   create()
   {
      this.assetForm.markAllAsTouched();
      //Check Validation
      if (this.assetForm.invalid) return;

      console.log(this.assetForm.value)
      if (this.asset == null)
         // Create Asset
         this._assetService.createAsset(this.assetForm.value).subscribe(
            (_) =>
            {
               this.openSnackBar("Success", "Asset Created");
               this._router.navigate(["../"], { relativeTo: this._activatedRoute });
            },
            (err) =>
            {
               let e: IDTO = err.error;
               this.openSnackBar("Error", e.message);
            }
         );
      // update asset
      else
         this._assetService.updateAsset(this.asset._id, this.assetForm.value).subscribe(
            (_) =>
            {
               this.openSnackBar("Success", "Asset Updated");
               this._router.navigate(["../"], { relativeTo: this._activatedRoute });
            },
            (err) =>
            {
               let e: IDTO = err.error;
               this.openSnackBar("Error", e.message);
            }
         );
   }

   removeTypeFromForm()
   {
      for (const [key, value] of Object.entries(this.types))
      {
         if (this.assetForm.contains(value as string)) this.assetForm.removeControl(value as string);
      }
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



   addWarranty()
   {
      (this.assetForm.get("warranty") as UntypedFormArray).push(AssetForm.WarrantyForm());
   }

   goForward(formGroupName: string, stepper: MatStepper)
   {
      //Asset Type
      if (formGroupName == "asset")
      {
         this.assetForm.get("category").markAllAsTouched();
         this.assetForm.get("branch").markAllAsTouched();
         this.assetForm.get("name").markAllAsTouched();

         if (this.assetForm.get("category").valid && this.assetForm.get("branch").valid && this.assetForm.get("name").valid) stepper.next();
      }
      //System Information
      else if (formGroupName == "os")
      {
         //Multiple form Groups needs to be validated OS SYSTEM
         this.assetForm.get(`${this.type}.system`).markAllAsTouched();
         this.assetForm.get(`${this.type}.os`).markAllAsTouched();

         //if valid move next
         if (this.assetForm.get(`${this.type}.system`).valid && this.assetForm.get(`${this.type}.os`).value) stepper.next();
      }

      //Memory / Disk
      else if (formGroupName == "diskLayout")
      {
         //Multiple form Groups needs to be validated MEM DiskLayout cpu
         this.assetForm.get(`${this.type}.cpu`).markAllAsTouched();
         this.assetForm.get(`${this.type}.mem`).markAllAsTouched();
         this.assetForm.get(`${this.type}.diskLayout`).markAllAsTouched();

         //if valid move next
         if (
            this.assetForm.get(`${this.type}.cpu`).valid &&
            this.assetForm.get(`${this.type}.mem`).valid &&
            this.assetForm.get(`${this.type}.diskLayout`).valid
         )
            stepper.next();
      }

      //Warranty will be validated by createFN
   }
}
