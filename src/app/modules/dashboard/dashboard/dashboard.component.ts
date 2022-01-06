import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: IUser;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _userService: UserService, private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      if (user != null) this.user = user;
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
