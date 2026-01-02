import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { AuditService } from "src/app/core/audit/audit.service";
import { AssetService } from "src/app/core/asset/asset.service";
import { IAudit, IAuditAsset, AuditStatus } from "src/app/core/audit/audit.types";
import { IAsset } from "src/app/core/asset/asset.types";
import { AssetShortDetailComponent } from "../../shared/asset-short-detail/asset-short-detail.component";

@Component({
  selector: "app-audit-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class AuditDetailsComponent implements OnInit {
  audit: IAudit | null = null;
  assets: IAuditAsset[] = [];
  progress: any = null;
  isLoading = true;

  constructor(
    private _route: ActivatedRoute,
    public router: Router,
    private _auditService: AuditService,
    private _assetService: AssetService,
    private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get("id");
    if (!id) {
      this.router.navigate(["/audit"]);
      return;
    }

    // Try to get data from resolver first (if available)
    const routeData = this._route.snapshot.data;
    let resolverData: any[] = null;

    // Angular stores resolver data - check if it's an array or object with array values
    if (Array.isArray(routeData)) {
      resolverData = routeData;
    } else if (routeData && typeof routeData === 'object') {
      const values = Object.values(routeData);
      if (values.length > 0) {
        if (Array.isArray(values[0])) {
          resolverData = values[0];
        } else if (values.length >= 2) {
          resolverData = values as any[];
        }
      }
    }

    // Always load from service for reliability
    // Resolver data can be used as fallback, but service call ensures fresh data
    this._auditService.getAuditById(id).subscribe({
      next: (audit) => {
        this.audit = audit;
        this.loadAssets();
        this.loadProgress();
      },
      error: (err) => {
        console.error("Error loading audit:", err);
        // Try to use resolver data as fallback
        if (resolverData && resolverData.length >= 1 && resolverData[0]) {
          this.audit = resolverData[0];
          if (resolverData.length >= 2 && resolverData[1]) {
            this.progress = resolverData[1];
          }
          this.loadAssets();
        } else {
          this.router.navigate(["/audit"]);
        }
      },
    });
  }

  loadAssets(): void {
    if (!this.audit?._id) return;
    this._auditService.getAuditAssets(this.audit._id).subscribe({
      next: (assets) => {
        this.assets = assets;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadProgress(): void {
    if (!this.audit?._id) return;
    this._auditService.getAuditProgress(this.audit._id).subscribe({
      next: (progress) => {
        this.progress = progress;
      },
    });
  }

  getProgressPercentage(): number {
    if (!this.audit || !this.audit.totalAssets) return 0;
    return Math.round(
      ((this.audit.scannedAssets || 0) / this.audit.totalAssets) * 100
    );
  }

  getStatusColor(status: string): string {
    switch (status) {
      case AuditStatus.OPEN:
        return "bg-blue-100 text-blue-800";
      case AuditStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case AuditStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  completeAudit(): void {
    if (!this.audit?._id || this.audit.isClosed) return;

    const unscanned =
      (this.audit.totalAssets || 0) - (this.audit.scannedAssets || 0);
    if (unscanned > 0) {
      const confirmed = confirm(
        `There are ${unscanned} unscanned assets. Do you want to mark them as missing and complete the audit?`
      );
      if (!confirmed) return;
    }

    this._auditService
      .completeAudit(this.audit._id, { forceComplete: true })
      .subscribe({
        next: () => {
          this.router.navigate(["/audit"]);
        },
      });
  }

  viewReport(): void {
    if (this.audit?._id) {
      this.router.navigate([`/audit/${this.audit._id}/report`]);
    }
  }

  getBranchName(audit: IAudit): string {
    if (!audit.branchId) return "Loading...";
    return typeof audit.branchId === "object" && audit.branchId?.name
      ? audit.branchId.name
      : "Loading...";
  }

  getDepartmentNames(audit: IAudit): string[] {
    if (!audit.departmentIds) return [];
    const depts = Array.isArray(audit.departmentIds)
      ? audit.departmentIds
      : [];
    return depts.map((dept: any) =>
      typeof dept === "object" && dept?.name ? dept.name : String(dept)
    );
  }

  getAssetName(asset: IAuditAsset): string {
    if (!asset.assetId) return "N/A";
    if (typeof asset.assetId === "object") {
      return asset.assetId.name || asset.assetId._id || "N/A";
    }
    return asset.assetId || "N/A";
  }

  getScannedByName(asset: IAuditAsset): string {
    if (!asset.scannedBy) return "-";
    if (typeof asset.scannedBy === "object") {
      return `${asset.scannedBy.firstName || ""} ${asset.scannedBy.lastName || ""}`.trim() || "-";
    }
    return "-";
  }

  openAssetDetail(asset: IAuditAsset, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // If assetId is already an object (IAsset), use it directly
    if (asset.assetId && typeof asset.assetId === "object") {
      this._matDialog.open(AssetShortDetailComponent, { data: asset.assetId as IAsset });
      return;
    }

    // If assetId is a string, fetch the asset first
    if (asset.assetId && typeof asset.assetId === "string") {
      this._assetService.getAssetById(asset.assetId).subscribe({
        next: (fullAsset) => {
          this._matDialog.open(AssetShortDetailComponent, { data: fullAsset });
        },
        error: (err) => {
          console.error("Error loading asset details:", err);
        },
      });
      return;
    }
  }
}
