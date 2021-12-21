import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";

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
export class DetailsComponent implements OnInit, OnDestroy {
  private unsubscribeAll: Subject<any> = new Subject<any>();
  assetForm: FormGroup;
  categories: string[] = ["Hardware", "Software"]; // Hardware / Software
  branches: string[] = ["Ahmedabad", "Delhi", "US"];
  types; // All type of asset Types

  constructor(private _formBuilder: FormBuilder, private _assetService: AssetService) {}

  // Life Cycle Hooks

  ngOnInit(): void {
    // Get All Category & Types
    this._assetService.assetTypes$.pipe(takeUntil(this.unsubscribeAll)).subscribe((val) => {
      this.types = val.commonAssetFields.find((x) => x.fieldName == "type").values;
    });

    //create Asset Form
    this.assetForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      assetCode: [""],
      type: ["", [Validators.required]],
      sr_no: ["", [Validators.required]],
      location: ["", [Validators.required]],
      vendorId: [""],
      category: ["", [Validators.required]],
      warranty: [""],
    });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

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
          hostName: ["", Validators.required],
          ram: ["", [Validators.required, Validators.pattern("^(0|[1-9][0-9]*)$")]],
          operatingSystem: ["", Validators.required],
          processor: ["", Validators.required],
          storageType: ["", Validators.required],
          storageSize: ["", Validators.required],
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
  }

  //Create Asset
  create() {
    this.assetForm.markAllAsTouched();
    console.log(this.assetForm.value);
  }

  removeTypeFromForm() {
    for (const [key, value] of Object.entries(this.types)) {
      if (this.assetForm.contains(value as string)) this.assetForm.removeControl(value as string);
    }
  }
}
