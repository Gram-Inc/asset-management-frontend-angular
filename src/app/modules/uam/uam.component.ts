import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { UamService } from "src/app/core/uam/uam.service";
import { IUAM } from "src/app/core/uam/uam.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
@Component({
  selector: "app-uam",
  templateUrl: "./uam.component.html",
  styleUrls: ["./uam.component.scss"],
})
export class UamComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  uams$: Observable<IUAM[]>;
  types: string[];
  pagination: IPagination;
  selectedUAM: IUAM | null = null;
  flashMessage: "success" | "error" | null = null;

  isLoading: boolean = false;

  searchCtrl: FormControl = new FormControl("");

  constructor(private _uamService: UamService) {}

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          return this._uamService.getUAMS(1, 10, query);
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

    // Get the Assets
    this.uams$ = this._uamService.uams$;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
