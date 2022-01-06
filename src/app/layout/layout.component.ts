import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { MatDrawer, MatDrawerMode } from "@angular/material/sidenav";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { SideNavService } from "../core/side-nav/side-nav.service";
import { UserService } from "../core/user/user.service";
import { IUser } from "../core/user/user.types";

@Component({
  selector: "layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  user: IUser = undefined;
  mode: MatDrawerMode = "side";
  @ViewChild("drawer") public drawer: MatDrawer;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modeService: SideNavService,
    private _router: Router
  ) {}
  //c
  ngOnChanges(changes: SimpleChanges): void {
    if (this._router.isActive("/uam/create", false)) this.drawer.opened = false;
  }
  ngOnInit(): void {
    // Attach a listener to the NavigationEnd event
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: NavigationEnd) => {
        // Mark if active
        if (this._router.isActive("/uam/create", false)) this.drawer.opened = false;
      });

    this._modeService.mode$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.mode = val;
    });

    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      this.user = user;
    });
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  ngAfterViewInit(): void {
    this._modeService.setDrawer(this.drawer);
  }
  toggleDrawer() {
    this.drawer.toggle();
  }
}
