import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpecCardComponent } from "./spec-card/spec-card.component";
import { SpecCardListComponent } from "./spec-card-list.component";
import { BytesToGBPipe } from "src/app/core/pipes/bytes-to-gb.pipe";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [SpecCardComponent, SpecCardListComponent, BytesToGBPipe],
  imports: [CommonModule],
  exports: [SpecCardListComponent],
})
export class SpecCardListModule {}
