import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AutoCompleteService } from 'src/app/core/auto-complete/auto-complete.service';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { ITicket, TicketStatus } from 'src/app/core/ticket/ticket.types';
import { IUser } from 'src/app/core/user/user.types';

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
        .assign-search {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          color: #6b7280;
          font-size: 0.8125rem;
        }
      }
    `,
   ],
   encapsulation: ViewEncapsulation.None,
})
export class TicketAssignComponent implements OnInit, OnDestroy
{

   filteredRequesterForAutoComplete: IUser[] = [];
   searching = false;
   assigning = false;
   private searchSeq = 0;
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   ITUserCtrl = new FormControl('')
   selectedUser: IUser;
   constructor(private _snackBar: MatSnackBar,
      private _autoCompleteService: AutoCompleteService,
      private ticketService: TicketService,
      @Inject(MAT_DIALOG_DATA) public data: ITicket,
      public matDialogRef: MatDialogRef<TicketAssignComponent>
   ) { }

   ngOnInit(): void
   {
      this._autoCompleteService.ITUsers.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.filteredRequesterForAutoComplete = val || [];
      });

      this.fetchUsers('').pipe(takeUntil(this._unsubscribeAll)).subscribe();

      this.ITUserCtrl
         .valueChanges.pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            tap((value: string) =>
            {
               if (!this.selectedUser || value !== this.selectedUser._id)
               {
                  this.selectedUser = this.filteredRequesterForAutoComplete.find((user) => user._id === value) || null;
               }
            }),
            switchMap((query) => this.fetchUsers(typeof query === 'string' ? query : '')),
         )
         .subscribe();
   }

   ngOnDestroy(): void
   {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
   }

   selectUser(userId: string): void
   {
      this.selectedUser = this.filteredRequesterForAutoComplete.find((user) => user._id === userId) || null;
   }

   displayFn(value: string): string
   {
      if (!value) return '';
      const user = this.filteredRequesterForAutoComplete.find((usr) => usr._id === value)
         || (this.selectedUser?._id === value ? this.selectedUser : null);
      if (!user) return value;
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
   }

   private fetchUsers(query: string)
   {
      if (this.selectedUser && query === this.selectedUser._id)
      {
         this.searching = false;
         return of(null);
      }
      const seq = ++this.searchSeq;
      this.searching = true;
      return this._autoCompleteService.getITUsers(1, 10, query).pipe(
         catchError(() =>
         {
            this.openSnackBar('Error', 'Could not search users.');
            return of(null);
         }),
         tap(() =>
         {
            if (seq === this.searchSeq) this.searching = false;
         }),
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
   assign()
   {
      if (this.assigning) return;
      if (!this.selectedUser?._id)
      {
         this.openSnackBar('Error', 'Select a user to assign.');
         return;
      }
      if (!this.data || !this.data._id)
      {
         this.openSnackBar('Error', 'Ticket ID is missing.');
         return;
      }
      const ticketId = this.data._id;
      this.assigning = true;
      this.ticketService.updateTicket(ticketId, {
         ...this.data,
         _id: ticketId,
         assignedToUserId: this.selectedUser._id,
         callStatus: this.data.callStatus === TicketStatus.Open ? TicketStatus.Assigned : this.data.callStatus,
      }).subscribe(
         () =>
         {
            this.assigning = false;
            this.openSnackBar('Success', 'Ticket assigned');
            this.matDialogRef.close(true);
         },
         (err) =>
         {
            this.assigning = false;
            const message = err?.error?.message;
            this.openSnackBar('Error', Array.isArray(message) ? message.join(' ') : (message || 'Failed to assign ticket.'));
         }
      );
   }
}
