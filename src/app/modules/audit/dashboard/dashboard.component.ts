import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuditService } from "src/app/core/audit/audit.service";
import {
  IAuditStatistics,
  IDepartmentAuditHistory,
} from "src/app/core/audit/audit.types";

@Component({
  selector: "app-audit-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class AuditDashboardComponent implements OnInit {
  statistics: IAuditStatistics | null = null;
  departmentHistory: IDepartmentAuditHistory[] = [];
  isLoading: boolean = false;

  constructor(
    private _auditService: AuditService,
    private _route: ActivatedRoute,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Load from resolver
    const routeData = this._route.snapshot.data;
    if (routeData && Array.isArray(routeData) && routeData.length >= 2) {
      this.statistics = routeData[0];
      this.departmentHistory = routeData[1] || [];
      // Data loaded from resolver, no need to show loading
      this.isLoading = false;
      return;
    }

    // Load if not in resolver data
    this.isLoading = true;
    let statsLoaded = false;
    let historyLoaded = false;

    const checkComplete = () => {
      if (statsLoaded && historyLoaded) {
        this.isLoading = false;
      }
    };

    if (!this.statistics) {
      this._auditService.getAuditStatistics().subscribe({
        next: (stats) => {
          this.statistics = stats;
          statsLoaded = true;
          checkComplete();
        },
        error: () => {
          statsLoaded = true;
          checkComplete();
        },
      });
    } else {
      statsLoaded = true;
    }

    if (this.departmentHistory.length === 0) {
      this._auditService.getDepartmentAuditHistory().subscribe({
        next: (history) => {
          this.departmentHistory = history || [];
          historyLoaded = true;
          checkComplete();
        },
        error: () => {
          historyLoaded = true;
          checkComplete();
        },
      });
    } else {
      historyLoaded = true;
      checkComplete();
    }
  }

  formatDate(date: Date | string | null): string {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString();
  }
}
