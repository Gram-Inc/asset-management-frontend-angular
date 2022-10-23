import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { AutoCompleteService } from "src/app/core/auto-complete/auto-complete.service";
import { TicketService } from "src/app/core/ticket/ticket.service";
import { ITicket, TicketNatureOfCall, TicketPriority, TicketStatus } from "src/app/core/ticket/ticket.types";
import { IUser } from "src/app/core/user/user.types";
@Component({
   selector: "app-create-ticket",
   templateUrl: "./create-ticket.component.html",
   styleUrls: ["./create-ticket.component.scss"],
})
export class CreateTicketComponent implements OnInit
{

   private _unsubscribeAll: Subject<any> = new Subject<any>();

   ticket$: Observable<ITicket>;

   ticketForm: FormGroup;

   ticket: ITicket = null;

   priorityTypes = TicketPriority;
   natureOfCallEnum = TicketNatureOfCall;
   //Auto Complete

   filteredCategoryForAutoComplete: Observable<string[]>;

   filteredRequesterForAutoComplete: IUser[] = [];

   constructor(
      private _dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private _ticketService: TicketService,
      private _formBuilder: FormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _router: Router,
      private _activatedRoute: ActivatedRoute,
      private _autoCompleteService: AutoCompleteService
   ) { }

   ngOnInit(): void
   {
      //Create Branch Form

      this.ticketForm = this._formBuilder.group({
         _id: [""],
         requestFromUserId: ["", Validators.required],
         callMedium: ["chat", Validators.required],
         natureOfCall: ["request", Validators.required],
         category: ["", Validators.required],
         priority: [TicketPriority.Medium, Validators.required],
         description: [""],
         callStatus: [TicketStatus.Open],

      });

      this._ticketService.ticket$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.ticket = val;
         this.ticketForm.patchValue(val);

         // Mark for check
         this._changeDetectorRef.markForCheck();
      });

      this.ticketForm
         .get("category")
         .valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               return this._autoCompleteService.getCategories(1, 10, query);
            }),
            map(() => { })
         )
         .subscribe();

      this.filteredCategoryForAutoComplete = this._autoCompleteService.categories;

      this.ticketForm
         .get("requestFromUserId")
         .valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               return this._autoCompleteService.getRequesters(1, 10, query);
            }),
            map(() => { })
         )
         .subscribe();

      this._autoCompleteService.requesters.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.filteredRequesterForAutoComplete = val;
      });
   }

   ngOnDestroy(): void
   {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
   }
   create()
   {
      //Validate the Form
      this.ticketForm.markAllAsTouched();

      if (this.ticketForm.invalid) return;

      //CHECK IF UPDATE or Create

      //Update
      if (this.ticket)
         this._ticketService.updateTicket(this.ticket._id, this.ticketForm.value).subscribe(
            (_) =>
            {
               this.openSnackBar("Success", "Ticket Updated");
               this._router.navigate(["../"], {
                  relativeTo: this._activatedRoute,
               });
            },
            (err) =>
            {
               this.openSnackBar("Error", err.message);
            }
         );
      //Create
      else
         this._ticketService.createTicket(this.ticketForm.value).subscribe(
            (_) =>
            {
               this.openSnackBar("Success", "Ticket Created");
               this._router.navigate(["../"], {
                  relativeTo: this._activatedRoute,
               });
            },
            (err) =>
            {
               this.openSnackBar("Error", err.message);
            }
         );
   }

   openSnackBar(type: "Error" | "Info" | "Success", msg: string)
   {
      this._snackBar.open(msg, "Close", {
         duration: 3000,
         verticalPosition: "top",
         horizontalPosition: "center",
         panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
      });
   }

   setTaskPriority(value: TicketPriority)
   {
      this.ticketForm.controls["priority"].setValue(value);
   }

   displayFn(userId): string
   {
      let x = this.filteredRequesterForAutoComplete.find(usr => usr._id == userId);
      return x?.firstName ?? '';

   }
}
