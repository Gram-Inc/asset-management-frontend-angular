import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuditComponent } from "./audit.component";
import { RouterModule } from "@angular/router";
import { auditRoutes } from "./audit.routing";
import { SharedModule } from "../shared/shared.module";
import { CustomMaterialModule } from "../custom-material/custom-material.module";
import { AuditListComponent } from "./list/list.component";

@NgModule({
  declarations: [AuditComponent, AuditListComponent],
  imports: [
    CommonModule,
    SharedModule,
    CustomMaterialModule,
    RouterModule.forChild(auditRoutes),
  ],
})
export class AuditModule {}
