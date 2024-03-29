import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TitleCardComponent } from "./title-card/title-card.component";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { FullscreenComponent } from "./fullscreen/fullscreen.component";
import { UserComponent } from "./user/user.component";
import { ConfirmationModule } from "src/app/custom/confirmation/confirmation.module";
import { IconsModule } from "src/app/core/icons/icons.module";
import { ThemeTogglerComponent } from "./theme-toggler/theme-toggler.component";
import { AssetFilterComponent } from "./asset-filter/asset-filter.component";
import { AssetShortDetailComponent } from "./asset-short-detail/asset-short-detail.component";
import { QrcodeComponent } from "./qrcode/qrcode.component";
import { AssetSubDetailCardComponent } from "./asset-sub-detail-card/asset-sub-detail-card.component";
import { SpecCardListModule } from "../asset/spec-card-list/spec-card-list.module";
import { UserFilterComponent } from "./user-filter/user-filter.component";
import { SimpleTimelineModule } from "./simple-timeline/simple-timeline.module";
import { VendorFilterComponent } from "./vendor-filter/vendor-filter.component";
import { NgApexchartsModule } from "ng-apexcharts";
import { RouterModule } from "@angular/router";
import { TicketFilterComponent } from "./ticket-filter/ticket-filter.component";
import { BytesToGBPipe } from "src/app/core/pipes/bytes-to-gb.pipe";
import { AccessPillComponent } from "src/app/custom/components/access-pill/access-pill.component";
import { MomentModule } from "ngx-moment";

var sharedComp = [
   TitleCardComponent,
   FullscreenComponent,
   UserComponent,
   ThemeTogglerComponent,
   AssetFilterComponent,
   AssetSubDetailCardComponent,
   UserFilterComponent,
   QrcodeComponent,
   VendorFilterComponent,
   AccessPillComponent
];
@NgModule({
   declarations: [...sharedComp, AssetShortDetailComponent, TicketFilterComponent],
   imports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      CustomMaterialModule,
      ConfirmationModule,
      IconsModule,
      SpecCardListModule,
      SimpleTimelineModule,
      NgApexchartsModule,
      RouterModule,
   ],
   exports: [
      CommonModule,
      ReactiveFormsModule,
      FormsModule,
      ConfirmationModule,
      SimpleTimelineModule,
      IconsModule,
      NgApexchartsModule,
      MomentModule,
      ...sharedComp,
   ],
})
export class SharedModule { }
