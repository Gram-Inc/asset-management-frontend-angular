import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AutoCompleteService } from 'src/app/core/auto-complete/auto-complete.service';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { ITicket } from 'src/app/core/ticket/ticket.types';
import { UserService } from 'src/app/core/user/user.service';
import { IUser } from 'src/app/core/user/user.types';
import { RikielConfirmationService } from 'src/app/custom/confirmation/confirmation.service';

@Component({
   selector: 'app-ticket-assign',
   templateUrl: './ticket-assign.component.html',
   styles: [
      /* language=SCSS */
      `
      .fuse-confirmation-dialog-panel {
        /* @screen md {
          @apply w-128;
        } */

        .mat-dialog-container {
          padding: 0 !important;
        }
      }
    `,
   ],
   encapsulation: ViewEncapsulation.None,
})
export class TicketAssignComponent implements OnInit
{

   filteredRequesterForAutoComplete: IUser[] = [];
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   ITUserCtrl = new FormControl('')
   selectedUser: IUser;
   constructor(private _snackBar: MatSnackBar,
      private _autoCompleteService: AutoCompleteService,
      private userService: UserService,
      private ticketService: TicketService,
      @Inject(MAT_DIALOG_DATA) public data: ITicket,
      public matDialogRef: MatDialogRef<TicketAssignComponent>
   ) { }

   ngOnInit(): void
   {
      this._autoCompleteService.getITUsers();
      this._autoCompleteService.ITUsers.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.filteredRequesterForAutoComplete = val;
      });

      this.ITUserCtrl
         .valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            tap(v =>
            {

               if (v && v.length >= 12) this.userService.getUserById(this.ITUserCtrl.value).subscribe((val) =>
               {
                  this.selectedUser = val;
               });
               else this.selectedUser = null
            }),
            switchMap((query) =>
            {
               return this._autoCompleteService.getITUsers(1, 10, query);
            }),

         )
         .subscribe();
   }

   displayFn(userId): string
   {
      let x = this.filteredRequesterForAutoComplete.find(usr => usr._id == userId);
      return x?.firstName ?? '';

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
   assign()
   {
      if (this.ITUserCtrl.invalid || !this.selectedUser)
      {
         this.openSnackBar('Error', 'Invalid data.');
         return;
      }
      if (!this.data || !this.data._id)
      {
         this.openSnackBar('Error', 'Ticket ID is missing.');
         return;
      }
      this.data.assignedToUserId = this.ITUserCtrl.value
      this.ticketService.updateTicket(this.data._id, this.data).subscribe(
         (x) =>
         {
            this.openSnackBar('Success', 'Ticket Assigned')
            this.matDialogRef.close();
         },
         (err) =>
         {
            this.openSnackBar('Error', err.message || 'Failed to assign ticket.');
         }
      )

   }
}
