import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardService } from "src/app/core/dashboard/dashboard.service";
import { IDashboard } from "src/app/core/dashboard/dashboard.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: IUser;
  dashboard: IDashboard;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _userService: UserService,
    private _dashboardService: DashboardService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      if (user != null) this.user = user;
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });

    //Subscribe to Dashboard Data
    this._dashboardService.dashboard$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val: IDashboard) => {
      this.dashboard = val;
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
