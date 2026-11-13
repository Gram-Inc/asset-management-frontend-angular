import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { ITicket, ITicketChat, TicketStatus } from 'src/app/core/ticket/ticket.types';
import { UserService } from 'src/app/core/user/user.service';
import { IUser } from 'src/app/core/user/user.types';
import { TicketAssignComponent } from '../ticket-assign/ticket-assign.component';

@Component({
   selector: 'app-ticket-detail',
   templateUrl: './ticket-detail.component.html',
   styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy
{

   ticket: ITicket;
   requestedUser: IUser;
   assignedUser: IUser;
   currentUserId: string = '';
   commentCtrl: FormControl = new FormControl('', [Validators.required])
   chat: ITicketChat[];
   statusCtrl: FormControl = new FormControl('');
   closingDescriptionCtrl: FormControl = new FormControl('', [Validators.required]);
   showCloseDialog: boolean = false;
   TicketStatus = TicketStatus;
   availableStatuses: TicketStatus[] = [
      TicketStatus.Open,
      TicketStatus.Assigned,
      TicketStatus.InProgress,
      TicketStatus.Hold,
      TicketStatus.VendorDependency,
      TicketStatus.Closed
   ];
   private _unsubscribeAll: Subject<any> = new Subject();
   constructor(
      private _ticketService: TicketService,
      private _authService: AuthService,
      private _userService: UserService,
      private dialog: MatDialog,
      private _snackBar: MatSnackBar,
      private _router: Router,
      private _route: ActivatedRoute
   ) { }

   private ticketId(): string
   {
      if (this.ticket?._id) return this.ticket._id;
      let route = this._route.snapshot;
      while (route)
      {
         const id = route.paramMap.get('id');
         if (id) return id;
         route = route.parent;
      }
      return '';
   }

   ngOnInit(): void
   {
      this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe(user =>
      {
         this.currentUserId = user?._id || '';
      });

      this._ticketService.ticket$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x =>
      {
         if (x)
         {
            this.ticket = x
            this.statusCtrl.setValue(x.callStatus || TicketStatus.Open);

            // Get User
            const requestFromUserId = typeof x.requestFromUserId === 'string'
               ? x.requestFromUserId
               : (x.requestFromUserId?._id || '');
            if (requestFromUserId) {
               this._userService.getUserById(requestFromUserId).subscribe(usr => this.requestedUser = usr);
            } else if (typeof x.requestFromUserId === 'object' && x.requestFromUserId !== null) {
               this.requestedUser = x.requestFromUserId as IUser;
            }

            if (x.assignedToUserId) {
               const assignedToUserId = typeof x.assignedToUserId === 'string'
                  ? x.assignedToUserId
                  : (x.assignedToUserId?._id || '');
               if (assignedToUserId) {
                  this._userService.getUserById(assignedToUserId).subscribe(usr => this.assignedUser = usr);
               } else if (typeof x.assignedToUserId === 'object' && x.assignedToUserId !== null) {
                  this.assignedUser = x.assignedToUserId as IUser;
               }
            }
            const chatTicketId = x._id || this.ticketId();
            if (chatTicketId) {
               this._ticketService.getTicketChat(chatTicketId).subscribe(y => { this.chat = y })
            }
         }
      })
   }
   ngOnDestroy(): void
   {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
   }

   checkRole(role: 'level1' | 'level2' | 'level3')
   {
      return this._authService.checkRole(role);
   }

   checkLevel1OrLevel2()
   {
      return this._authService.checkRole('level1').pipe(
         switchMap(level1 => {
            if (level1) return of(true);
            return this._authService.checkRole('level2');
         })
      );
   }

   canChangeStatus(): Observable<boolean>
   {
      return this.checkLevel1OrLevel2().pipe(
         map(hasAccess => hasAccess && this.ticket?.callStatus !== 'Closed')
      );
   }

   showReadOnlyStatus(): Observable<boolean>
   {
      return this.checkLevel1OrLevel2().pipe(
         map(hasAccess => !hasAccess || this.ticket?.callStatus === 'Closed')
      );
   }
   postComment()
   {
      if (this.commentCtrl.invalid) return;
      this._ticketService.postTicketChatComment({ ticket: this.ticket._id, message: this.commentCtrl.value }).subscribe(x =>
      {
         this._ticketService.getTicketChat(this.ticket._id).subscribe(y => { this.chat = y })
         this.commentCtrl.reset();
      })
   }

   assignTicket()
   {
      const ticketId = this.ticketId();
      if (!ticketId)
      {
         this.openSnackBar('Error', 'Ticket ID is missing.');
         return;
      }
      this.dialog.open(TicketAssignComponent, {
         data: { ...this.ticket, _id: ticketId },
         panelClass: "fuse-confirmation-dialog-panel",
      }).afterClosed().subscribe((assigned) =>
      {
         if (assigned === true)
         {
            this._ticketService.getTicketById(ticketId).subscribe();
         }
      })
   }

   selectStatus(status: TicketStatus)
   {
      if (!this.ticketId()) return;

      this.statusCtrl.setValue(status);

      if (status === TicketStatus.Closed) {
         this.showCloseDialog = true;
         return;
      }

      this.updateStatus();
   }

   updateStatus()
   {
      const ticketId = this.ticketId();
      if (!ticketId) return;

      const newStatus = this.statusCtrl.value;

      // Only update if status actually changed
      if (newStatus === this.ticket.callStatus) {
         return;
      }

      const updateData = {
         ...this.ticket,
         callStatus: newStatus
      };

      this._ticketService.updateTicket(ticketId, updateData).subscribe(
         () => {
            this.openSnackBar('Success', 'Ticket status updated successfully');
            this._ticketService.getTicketById(ticketId).subscribe();
         },
         (err) => {
            this.openSnackBar('Error', err.message || 'Failed to update ticket status');
            // Revert status on error
            this.statusCtrl.setValue(this.ticket.callStatus || TicketStatus.Open);
         }
      );
   }

   closeTicket()
   {
      if (this.closingDescriptionCtrl.invalid) {
         this.closingDescriptionCtrl.markAsTouched();
         return;
      }

      const ticketId = this.ticketId();
      if (!ticketId) return;

      const updateData = {
         ...this.ticket,
         callStatus: TicketStatus.Closed,
         closingDescription: this.closingDescriptionCtrl.value
      };

      this._ticketService.updateTicket(ticketId, updateData).subscribe(
         () => {
            this.openSnackBar('Success', 'Ticket closed successfully');
            this.showCloseDialog = false;
            this.closingDescriptionCtrl.reset();
            this._ticketService.getTicketById(ticketId).subscribe();
         },
         (err) => {
            this.openSnackBar('Error', err.message || 'Failed to close ticket');
         }
      );
   }

   cancelClose()
   {
      this.showCloseDialog = false;
      this.closingDescriptionCtrl.reset();
      this.statusCtrl.setValue(this.ticket?.callStatus || TicketStatus.Open);
   }

   callMediumLabel(value?: string): string
   {
      if (!value) return '';
      const key = value.replace(/[\s_-]/g, '').toLowerCase();
      const labels: Record<string, string> = {
         phone: 'Phone',
         chat: 'Chat',
         email: 'Email',
         walkin: 'Walk-in',
      };
      return labels[key] || value;
   }

   isMine(cht: ITicketChat): boolean
   {
      return !!(this.currentUserId && cht?.messageByUser?._id === this.currentUserId);
   }

   statusPillClass(status?: string): string
   {
      switch (status)
      {
         case 'Closed':
            return 'ops-pill-ok';
         case 'In Progress':
         case 'Hold':
            return 'ops-pill-warn';
         case 'Open':
         case 'Assigned':
            return 'ops-pill-info';
         case 'Vendor Dependency':
         default:
            return 'ops-pill-neutral';
      }
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
}
