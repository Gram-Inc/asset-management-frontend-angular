import { Injectable } from "@angular/core";
import { MatDrawerMode } from "@angular/material/sidenav";
import { BehaviorSubject, Observable, ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SideNavService {
  private _mode: ReplaySubject<MatDrawerMode> = new ReplaySubject<MatDrawerMode>(1);
  private _opened: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  get mode$(): Observable<MatDrawerMode> {
    return this._mode.asObservable();
  }

  set mode(mde: MatDrawerMode) {
    this._mode.next(mde);
  }

  get opened$(): Observable<boolean> {
    return this._opened.asObservable();
  }

  set opened(val: boolean) {
    this._opened.next(val);
  }
  constructor() {
    this._mode.next("side");
  }
}
