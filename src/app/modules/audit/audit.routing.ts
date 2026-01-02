import { Routes } from "@angular/router";
import {
  AuditResolver,
  CreateAuditResolver,
  EditAuditResolver,
  AuditDashboardResolver,
} from "src/app/core/audit/audit.resolver";
import { AuditListComponent } from "./list/list.component";

export const auditRoutes: Routes = [
  {
    path: "",
    component: AuditListComponent,
    resolve: [AuditResolver],
  },
  {
    path: "create",
    resolve: [CreateAuditResolver],
    loadChildren: () =>
      import("./create/create.module").then((x) => x.CreateAuditModule),
  },
  {
    path: "dashboard",
    resolve: [AuditDashboardResolver],
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((x) => x.AuditDashboardModule),
  },
  {
    path: ":id",
    resolve: [EditAuditResolver],
    loadChildren: () =>
      import("./details/details.module").then((x) => x.AuditDetailsModule),
  },
  {
    path: ":id/report",
    resolve: [EditAuditResolver],
    loadChildren: () =>
      import("./report/report.module").then((x) => x.AuditReportModule),
  },
];
