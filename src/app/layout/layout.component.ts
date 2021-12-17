import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserService } from "../core/user/user.service";
import { IUser } from "../core/user/user.types";

@Component({
  selector: "layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy {
  user: IUser = undefined;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _userService: UserService, private _changeDetectorRef: ChangeDetectorRef) {}
  //c
  ngOnInit(): void {
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      this.user = user;
      // this._changeDetectorRef.markForCheck();
    });
  }
  ngOnDestroy() {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
