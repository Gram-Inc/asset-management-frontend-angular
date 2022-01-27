import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { throwError } from "rxjs/internal/observable/throwError";
import { AuthService } from "src/app/core/auth/auth.service";
import { LoadingService } from "src/app/core/loading/loading.service";

@Component({
  selector: "app-sign-in",
  templateUrl: "./sign-in.component.html",
  styleUrls: ["./sign-in.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class SignInComponent implements OnInit {
  @ViewChild("signInNgForm") signInNgForm: NgForm;

  alert: { type: any; message: string } = {
    type: "success",
    message: "",
  };
  signInForm: FormGroup;
  showAlert: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _loadingService: LoadingService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    this.signInForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
      rememberMe: [""],
    });
    this._loadingService.hide();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   */
  signIn(): void {
    // Return if the form is invalid
    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    try {
      // Sign in
      this._authService.signIn(this.signInForm.value).subscribe(
        () => {
          // Set the redirect url.
          // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
          // to the correct page after a successful sign in. This way, that url can be set via
          // routing file and we don't have to touch here.
          const redirectURL =
            this._activatedRoute.snapshot.queryParamMap.get("redirectURL") || "/signed-in-redirect";

          // Navigate to the redirect url
          this._router.navigateByUrl(redirectURL);
        },
        (response) => {
          // Re-enable the form
          this.signInForm.enable();

          // Reset the form
          this.signInNgForm.resetForm();

          // Show the alert
          this._snackBar.open("Wrong email or password")._dismissAfter(5000);
        }
      );
    } catch (err) {
      throwError(err);
    }
  }
}
