import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { isFuture, isValid } from "date-fns";
import { Observable, Subject } from "rxjs";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAsset } from "src/app/core/asset/asset.types";
import { IBranch } from "src/app/core/branch/branch.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";
import { debounceTime, map, startWith, switchMap, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-asset-bottom-sheet",
  templateUrl: "./asset-bottom-sheet.component.html",
  styleUrls: ["./asset-bottom-sheet.component.scss"],
})
export class AssetBottomSheetComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  users$: Observable<IUser[]> = new Observable<IUser[]>();
  asset: IAsset;
  searchCtrl: FormControl = new FormControl("");
  filteredUsers: Observable<IUser[]>;
  selectedUser: IUser = null;
  constructor(
    private _assetService: AssetService,
    private _userService: UserService,
    private _bottomSheetRef: MatBottomSheetRef<AssetBottomSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: IAsset
  ) {}

  ngOnInit(): void {
    this.users$ = this._userService.users$;
    this.asset = { ...this.data };

    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          return this._userService.getUsers(1, 10, query);
        }),
        map(() => {})
      )
      .subscribe();
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  isDateFuture(date) {
    if (isValid(date)) return isFuture(date);
    return false;
  }
  getBranchShortCode(branch: string | Partial<IBranch>): string {
    if (branch) return typeof branch === "object" ? branch.name : "-";
    return "NULL";
  }
  getBranchName(branch: string | Partial<IBranch>): string {
    if (branch) return typeof branch === "object" ? branch.name : "-";
    return "NULL";
  }
  updateAllocation() {}

  isAssetEdited(): boolean {
    return JSON.stringify(this.asset) != JSON.stringify(this.data);
  }

  displayFn(user: IUser): string {
    return user && user.firstName ? user.firstName + " " + user.lastName : "";
  }
  // Filter for Autocomplete Model Name Feature
}
