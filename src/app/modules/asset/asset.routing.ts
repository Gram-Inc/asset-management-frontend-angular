import { Routes } from "@angular/router";
import {
  AssetResolver,
  CreateAssetResolver,
  EditAssetResolver,
} from "src/app/core/asset/asset-resolver.resolver";
import { AssetFullDetailModule } from "./asset-full-detail/asset-full-detail.module";
import { AssetComponent } from "./asset.component";
import { AssetDetailComponent } from "./details/details.component";

export const assetRoutes: Routes = [
  {
    path: "",
    component: AssetComponent,
    resolve: [AssetResolver],
  },
  {
    path: "create",
    resolve: [CreateAssetResolver],
    component: AssetDetailComponent,
  },
  {
    path: ":id",
    resolve: [EditAssetResolver],
    loadChildren: () =>
      import("./asset-full-detail/asset-full-detail.module").then((x) => AssetFullDetailModule),
  },
];
