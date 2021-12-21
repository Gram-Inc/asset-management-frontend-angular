import { Routes } from "@angular/router";
import { AssetResolverResolver, CreateAssetResolver } from "src/app/core/asset/asset-resolver.resolver";
import { AssetComponent } from "./asset.component";
import { DetailsComponent } from "./details/details.component";

export const assetRoutes: Routes = [
  {
    path: "",
    component: AssetComponent,
    resolve: [AssetResolverResolver],
  },
  {
    path: "create",
    resolve: [CreateAssetResolver],
    component: DetailsComponent,
  },
];
