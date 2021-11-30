import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleCardComponent } from './title-card/title-card.component';

@NgModule({
  declarations: [
    TitleCardComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class SharedModule {}
