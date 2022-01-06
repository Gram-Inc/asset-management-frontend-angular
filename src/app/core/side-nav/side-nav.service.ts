import { Injectable } from "@angular/core";
import { MatDrawer, MatDrawerMode } from "@angular/material/sidenav";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SideNavService {
  private _mode: ReplaySubject<MatDrawerMode> = new ReplaySubject<MatDrawerMode>(1);
  private _opened: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private drawer: MatDrawer;

  get mode$(): Observable<MatDrawerMode> {
    return this._mode.asObservable();
  }

  setDrawer(drawer: MatDrawer) {
    this.drawer = drawer;
  }
  toggle(): void {
    this.drawer.toggle();
  }
  constructor() {
    this._mode.next("side");
  }
}
