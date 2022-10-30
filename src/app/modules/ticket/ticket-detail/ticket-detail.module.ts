import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDetailComponent } from './ticket-detail.component';
import { RouterModule } from '@angular/router';



@NgModule({
   declarations: [
      TicketDetailComponent
   ],
   imports: [
      CommonModule,
      RouterModule.forChild([{
         path: '',
         component: TicketDetailComponent
      }])
   ]
})
export class TicketDetailModule { }
