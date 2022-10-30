import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { ITicket } from 'src/app/core/ticket/ticket.types';

@Component({
   selector: 'app-ticket-detail',
   templateUrl: './ticket-detail.component.html',
   styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit, OnDestroy
{

   ticket: ITicket;
   private _unsubscribeAll: Subject<any> = new Subject();
   constructor(private _ticketService: TicketService) { }

   ngOnInit(): void
   {
      this._ticketService.ticket$.pipe(takeUntil(this._unsubscribeAll)).subscribe(x =>
      {
         this.ticket = x
      })
   }
   ngOnDestroy(): void
   {
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
   }

}
