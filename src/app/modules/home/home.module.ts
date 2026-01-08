import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CustomMaterialModule } from '../custom-material/custom-material.module';



@NgModule({
   declarations: [
      HomeComponent
   ],
   imports: [
      CommonModule,
      SharedModule,
      CustomMaterialModule,
      RouterModule.forChild([{ path: '', component: HomeComponent }])
   ]
})
export class HomeModule { }
