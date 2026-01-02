import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/core/auth/auth.service';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { ITicket, ITicketChat } from 'src/app/core/ticket/ticket.types';
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
   commentCtrl: FormControl = new FormControl('', [Validators.required])
   chat: ITicketChat[];
   private _unsubscribeAll: Subject<any> = new Subject();
   constructor(private _ticketService: TicketService, private _authService: AuthService, private _userService: UserService, private dialog: MatDialog) { }

   ngOnInit(): void
   {
      this._ticketService.ticket$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x =>
      {
         if (x)
         {
            console.log(x)
            this.ticket = x
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
            this._ticketService.getTicketChat(x._id).subscribe(y => { this.chat = y })
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
      this.dialog.open(TicketAssignComponent, {
         data: this.ticket,
         panelClass: "fuse-confirmation-dialog-panel",
      }).afterClosed().subscribe(x =>
      {
         this._ticketService.getTicketById(this.ticket._id).subscribe()
      })
   }
}
