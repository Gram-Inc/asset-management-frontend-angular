import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { LoadingService } from "src/app/core/loading/loading.service";

@Component({
   selector: "app-loading-bar",
   templateUrl: "./loading-bar.component.html",
   styleUrls: ["./loading-bar.component.scss"],
})
export class LoadingBarComponent implements OnInit, OnDestroy
{
   show = false;
   private _unsubscribeAll: Subject<any> = new Subject<any>();

   constructor(private _loadingService: LoadingService) { }

   ngOnInit(): void
   {
      this._loadingService.show$.pipe(takeUntil(this._unsubscribeAll)).subscribe((value) =>
      {
         // this.show = value; @Gramosx

      });
   }

   ngOnDestroy(): void
   {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }
}
