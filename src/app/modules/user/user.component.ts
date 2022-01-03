import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";
@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"],
})
export class UserComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  users$: Observable<IUser[]>;
  types: string[];
  pagination: IPagination;
  selectedUser: IUser | null = null;
  flashMessage: "success" | "error" | null = null;

  selectedAssetForm: FormGroup;
  isLoading: boolean = false;
  searchCtrl: FormControl = new FormControl("");

  constructor(
    private _dialog: MatDialog,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _rikielConfirmationService: RikielConfirmationService
  ) {}

  ngOnInit(): void {
    // Create Asset Form
    // Create the selected user form
    this.selectedAssetForm = this._formBuilder.group({
      _id: [""],
      name: ["", [Validators.required]],
      userCode: [""],
      location: [""],
      venderId: [""],
      sr_no: [""],
      life: [""],
      purchaseDate: [""],
      poNumber: [""],
    });

    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._userService.getUsers(1, 10, query);
        }),
        map(() => {
          this.isLoading = false;
        })
      )
      .subscribe();

    // Get the Assets
    this.users$ = this._userService.users$;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /**
   * Toggle user details
   *
   * @param userID
   */
  toggleDetails(userID: string): void {
    // If the user is already selected...
    if (this.selectedUser && this.selectedUser._id === userID) {
      // Close the details
      this.closeDetails();
      return;
    }

    // Get the user by id
    this._userService.getUserById(userID).subscribe((user) => {
      // Set the selected user
      this.selectedUser = user;

      // Fill the form
      this.selectedAssetForm.patchValue(user);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  /**
   * Close the details
   */
  closeDetails(): void {
    this.selectedUser = null;
  }

  /**
   * Update the selected user using the form data
   */
  updateSelecteduser(): void {
    // Get the user object
    const user = this.selectedAssetForm.getRawValue();

    // Update the user on the server
    this._userService.updateUser(user.id, user).subscribe(() => {
      // Show a success message
      this.showFlashMessage("success");
    });
  }

  /**
   * Delete the selected user using the form data
   */
  deleteSelectedAsset(): void {
    // Open the confirmation dialog
    const confirmation = this._rikielConfirmationService.open({
      title: "Delete user",
      message: "Are you sure you want to remove this user? This action cannot be undone!",
      actions: {
        confirm: {
          label: "Delete",
        },
      },
    });

    // Subscribe to the confirmation dialog closed action
    confirmation.afterClosed().subscribe((result) => {
      // If the confirm button pressed...
      if (result === "confirmed") {
        // Get the user object
        const user = this.selectedAssetForm.getRawValue();

        // Delete the user on the server
        this._userService.deleteUser(user._id).subscribe(() => {
          // Close the details
          this.closeDetails();
        });
      }
    });
  }

  /**
   * Show flash message
   */
  showFlashMessage(type: "success" | "error"): void {
    // Show the message
    this.flashMessage = type;

    // Mark for check
    this._changeDetectorRef.markForCheck();

    // Hide it after 3 seconds
    setTimeout(() => {
      this.flashMessage = null;

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }, 3000);
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item._id || index;
  }
}
