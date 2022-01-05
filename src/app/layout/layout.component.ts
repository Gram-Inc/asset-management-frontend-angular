import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { MatDrawerMode } from "@angular/material/sidenav";
import { Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SideNavService } from "../core/side-nav/side-nav.service";
import { UserService } from "../core/user/user.service";
import { IUser } from "../core/user/user.types";

@Component({
  selector: "layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy {
  user: IUser = undefined;
  mode: MatDrawerMode = "side";
  opened: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modeService: SideNavService
  ) {}
  //c
  ngOnInit(): void {
    this._modeService.mode$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.mode = val;
      this._changeDetectorRef.markForCheck();
    });

    this._modeService.opened$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.opened = val;
      this._changeDetectorRef.markForCheck();
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      this.user = user;
      // this._changeDetectorRef.markForCheck();
    });
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  toggleDrawer() {
    this._modeService.opened = !this.opened;
    this._changeDetectorRef.markForCheck();
  }
}
