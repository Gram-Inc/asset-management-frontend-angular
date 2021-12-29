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

var sharedComp = [
  TitleCardComponent,
  FullscreenComponent,
  UserComponent,
  ThemeTogglerComponent,
  AssetFilterComponent,
  AssetSubDetailCardComponent,
];
@NgModule({
  declarations: [...sharedComp, AssetShortDetailComponent, QrcodeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModule,
    ConfirmationModule,
    IconsModule,
  ],
  exports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmationModule, IconsModule, ...sharedComp],
})
export class SharedModule {}
