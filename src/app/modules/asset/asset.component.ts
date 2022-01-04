import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset, IPagination } from "src/app/core/asset/asset.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
import { AssetFilterComponent } from "../shared/asset-filter/asset-filter.component";

@Component({
  selector: "app-asset",
  templateUrl: "./asset.component.html",
  styleUrls: ["./asset.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AssetComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  assets$: Observable<IAsset[]>;
  types: string[];

  flashMessage: "success" | "error" | null = null;

  selectedAssetForm: FormGroup;
  isLoading: boolean = false;
  searchCtrl: FormControl = new FormControl("");

  constructor(
    private _dialog: MatDialog,
    private _assetService: AssetService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _rikielConfirmationService: RikielConfirmationService
  ) {}

  ngOnInit(): void {
    // Create Asset Form
    // Create the selected asset form
    this.selectedAssetForm = this._formBuilder.group({
      _id: [""],
      name: ["", [Validators.required]],
      assetCode: [""],
      location: [""],
      venderId: [""],
      sr_no: [""],
      life: [""],
      purchaseDate: [""],
      poNumber: [""],
    });

    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._assetService.getAssets(1, 10, query);
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

    // Get the Assets
    this.assets$ = this._assetService.assets$;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  dummy = {
    name: "Test",
    assetCode: "",
    type: "laptop",
    location: "",
    vendorId: "61810fc158cd8ec59c1b9d1b",
    sr_no: "Testttt",
    life: "12",
    category: "Hardware",
    subCategory: "Test",

    branch: "61ceec31e4b7f48faf4ea432",
    laptop: {
      system: {
        manufacturer: "Apple Inc.",
        model: "MacBookAir7,2",
        version: "1.0",
        serial: "C1MS5HW0H3QD",
        uuid: "68072723-0fbf-52b4-a01c-ceba4541230e",
        sku: "Mac-937CB26E2E02BB01",
        virtual: false,
      },
      os: {
        platform: "darwin",
        distro: "macOS",
        release: "11.6.1",
        codename: "macOS Big Sur",
        kernel: "20.6.0",
        arch: "x64",
        hostname: "Air.local",
        fqdn: "Air.local",
        codepage: "UTF-8",
        logofile: "darwin",
        serial: "ABC69550-60C2-34FE-B307-C24A8C39309C",
        build: "20G224",
        servicepack: "",
        uefi: true,
      },
      mem: {
        total: 8589934592,
        free: 21991424,
        used: 8567943168,
        active: 1808482304,
        available: 6781452288,
        buffers: 0,
        cached: 0,
        slab: 0,
        buffcache: 6759460864,
        swaptotal: 3221225472,
        swapused: 1877213184,
        swapfree: 1344012288,
      },
      memLayout: [
        {
          size: 4294967296,
          bank: "BANK 0",
          type: "DDR3",
          ecc: false,
          clockSpeed: 1600,
          formFactor: "",
          manufacturer: "Elpida",
          partNum: "-",
          serialNum: "-",
          voltageConfigured: null,
          voltageMin: null,
          voltageMax: null,
        },
        {
          size: 4294967296,
          bank: "BANK 1",
          type: "DDR3",
          ecc: false,
          clockSpeed: 1600,
          formFactor: "",
          manufacturer: "Elpida",
          partNum: "-",
          serialNum: "-",
          voltageConfigured: null,
          voltageMin: null,
          voltageMax: null,
        },
      ],
      battery: {
        hasBattery: true,
        cycleCount: 706,
        isCharging: false,
        designedCapacity: 56006,
        maxCapacity: 46097,
        currentCapacity: 35225,
        voltage: 7.833,
        capacityUnit: "mWh",
        percent: 80,
        timeRemaining: 317,
        acConnected: false,
        type: "Li-ion",
        model: "",
        manufacturer: "Apple",
        serial: "",
      },
      baseboard: {
        manufacturer: "Apple Inc.",
        model: "MacBookAir7,2",
        version: "1.0",
        serial: "C1MS5HW0H3QD",
        assetTag: "Mac-937CB26E2E02BB01",
        memMax: null,
        memSlots: 2,
      },
      cpu: {
        manufacturer: "Intel®",
        brand: "Core™ i5-5250U",
        cores: 4,
        physicalCores: 2,
        processors: 1,
      },
    },
  };
}
