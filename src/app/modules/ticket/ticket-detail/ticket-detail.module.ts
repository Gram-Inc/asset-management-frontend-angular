import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketDetailComponent } from './ticket-detail.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CustomMaterialModule } from '../../custom-material/custom-material.module';



@NgModule({
   declarations: [
      TicketDetailComponent
   ],
   imports: [
      CommonModule,
      RouterModule.forChild([{
         path: '',
         component: TicketDetailComponent
      }]),
      SharedModule,
      CustomMaterialModule
   ]
})
export class TicketDetailModule { }
