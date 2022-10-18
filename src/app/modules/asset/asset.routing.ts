import { Routes } from "@angular/router";
import
   {
      AssetResolver,
      ClrSelectedAsset,
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
      resolve: [CreateAssetResolver, ClrSelectedAsset],
      // component: AssetDetailComponent,
      loadChildren: () => import("./create-asset/create-asset.module").then((x) => x.CreateAssetModule),
   },
   {
      path: "edit/:id",
      resolve: [CreateAssetResolver, EditAssetResolver],
      // component: AssetDetailComponent,
      loadChildren: () => import("./create-asset/create-asset.module").then((x) => x.CreateAssetModule),
   },
   {
      path: "scanned",
      resolve: [],
      loadChildren: () => import("./scanned-asset/scanned-asset.module").then((x) => x.ScannedAssetModule),
   },
   {
      path: ":id",
      resolve: [EditAssetResolver],
      loadChildren: () =>
         import("./asset-full-detail/asset-full-detail.module").then((x) => AssetFullDetailModule),
   },
];
