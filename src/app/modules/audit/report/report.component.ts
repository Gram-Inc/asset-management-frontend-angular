import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuditService } from "src/app/core/audit/audit.service";
import { IAudit, IAuditAsset } from "src/app/core/audit/audit.types";
import { IAsset } from "src/app/core/asset/asset.types";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-audit-report",
  templateUrl: "./report.component.html",
  styleUrls: ["./report.component.scss"],
})
export class AuditReportComponent implements OnInit {
  audit: IAudit | null = null;
  scannedAssets: IAuditAsset[] = [];
  missingAssets: IAuditAsset[] = [];

  constructor(
    private _route: ActivatedRoute,
    public router: Router,
    private _auditService: AuditService
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    if (!id) {
      this.router.navigate(["/audit"]);
      return;
    }

    // Load audit from resolver
    const routeData = this._route.snapshot.data;
    if (routeData && Array.isArray(routeData) && routeData.length >= 1) {
      this.audit = routeData[0];
    }

    // Load if not in resolver data
    if (!this.audit) {
      this._auditService.getAuditById(id).subscribe({
        next: (audit) => {
          this.audit = audit;
          this.loadReportData();
        },
        error: () => {
          this.router.navigate(["/audit"]);
        },
      });
    } else {
      this.loadReportData();
    }
  }

  loadReportData(): void {
    if (!this.audit?._id) return;
    this._auditService.getAuditAssets(this.audit._id).subscribe({
      next: (assets) => {
        this.scannedAssets = assets.filter((a) => a.isScanned);
        this.missingAssets = assets.filter((a) => a.isMissing);
      },
      error: () => {
        // Handle error
      },
    });
  }

  getAssetName(asset: IAuditAsset): string {
    if (!asset.assetId) return "N/A";
    return typeof asset.assetId === "object" && (asset.assetId as IAsset).name
      ? (asset.assetId as IAsset).name
      : (asset.assetId as IAsset)._id || "N/A";
  }

  getScannedByName(asset: IAuditAsset): string {
    if (!asset.scannedBy) return "N/A";
    return typeof asset.scannedBy === "object" &&
      (asset.scannedBy as IUser).firstName
      ? `${(asset.scannedBy as IUser).firstName} ${(asset.scannedBy as IUser).lastName}`
      : "N/A";
  }
}
