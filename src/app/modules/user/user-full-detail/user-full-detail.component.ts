import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-user-full-detail",
  templateUrl: "./user-full-detail.component.html",
  styleUrls: ["./user-full-detail.component.scss"],
})
export class UserFullDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user: IUser;
  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this._userService.selectedUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      if (val) this.user = val;
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getDepartmentName(user: IUser) {
    if (user.departmentId && typeof user.departmentId == "object") return user.departmentId.name;
    return "-";
  }
  getUserLevel(user: IUser) {
    if (user.role == "level1") return "Level 1";
    else if (user.role == "level2") return "Level 2";
    else return "Level 3";
  }
}
