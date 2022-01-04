import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subject } from "rxjs";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-uam-detail",
  templateUrl: "./uam-detail.component.html",
  styleUrls: ["./uam-detail.component.scss"],
})
export class UamDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  requestType: "c" | "m" | "d" | "de" = "m";
  noOfUser: "single" | "multiple" = "single";

  // User
  users$: Observable<IUser[]> = new Observable<IUser[]>();
  //Branchs
  branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();

  uamForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _branchService: BranchService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Get All Branch
    this.branchs$ = this._branchService.branchs$;

    //Get All User
    this.users$ = this._userService.users$;

    // Create UAM Form
    this.uamForm = this._formBuilder.group({
      name: ["", [Validators.required]],
      assetCode: [""],
      type: ["laptop", [Validators.required]], // Set the Value as its KEYVALUE PAIR
      sr_no: ["", [Validators.required]],
      vendorId: [null],
      category: ["", [Validators.required]],
      warranty: [[]],
      branch: [null],
    });
  }
  //On Destroy
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
