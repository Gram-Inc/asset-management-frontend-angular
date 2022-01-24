import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TicketService } from "src/app/core/ticket/ticket.service";
import { ITicket } from "src/app/core/ticket/ticket.types";
@Component({
  selector: "app-create-ticket",
  templateUrl: "./create-ticket.component.html",
  styleUrls: ["./create-ticket.component.scss"],
})
export class CreateTicketComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  ticket$: Observable<ITicket>;

  ticketForm: FormGroup;

  ticket: ITicket = null;

  constructor(
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _ticketService: TicketService,
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Create Branch Form

    this.ticketForm = this._formBuilder.group({
      _id: [""],
      requestFromUserId: ["", Validators.required],
      callMedium: ["", Validators.required],
      department: ["", Validators.required],
      natureOfCall: ["", Validators.required],
      email: ["", Validators.required],
      category: ["", Validators.required],
      subCategory: ["", Validators.required],
      priority: ["", Validators.required],
      description: ["", Validators.required],
      callStatus: [""],
    });

    this._ticketService.ticket$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      this.ticket = val;
      this.ticketForm.patchValue(val);

      // Mark for check
      this._changeDetectorRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
  create() {
    //Validate the Form
    this.ticketForm.markAllAsTouched();

    if (this.ticketForm.invalid) return;

    //CHECK IF UPDATE or Create

    //Update
    if (this.ticket)
      this._ticketService.updateTicket(this.ticket._id, this.ticketForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Ticket Updated");
          this._router.navigate(["../"], {
            relativeTo: this._activatedRoute,
          });
        },
        (err) => {
          this.openSnackBar("Error", err.message);
        }
      );
    //Create
    else
      this._ticketService.createTicket(this.ticketForm.value).subscribe(
        (_) => {
          this.openSnackBar("Success", "Ticket Created");
          this._router.navigate(["../"], {
            relativeTo: this._activatedRoute,
          });
        },
        (err) => {
          this.openSnackBar("Error", err.message);
        }
      );
  }

  openSnackBar(type: "Error" | "Info" | "Success", msg: string) {
    this._snackBar.open(msg, "Close", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
    });
  }
}
