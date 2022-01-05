import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DetailComponent } from "./detail.component";
import { DetailsComponent } from "../../asset/details/details.component";

@NgModule({
  declarations: [DetailComponent],
  imports: [CommonModule],
  exports: [DetailsComponent],
})
export class DetailModule {}
