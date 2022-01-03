import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpecCardComponent } from "./spec-card/spec-card.component";
import { SpecCardListComponent } from "./spec-card-list.component";

@NgModule({
  declarations: [SpecCardComponent, SpecCardListComponent],
  imports: [CommonModule],
})
export class SpecCardListModule {}
