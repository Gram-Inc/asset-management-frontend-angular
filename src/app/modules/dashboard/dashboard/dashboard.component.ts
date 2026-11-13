import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DashboardService } from "src/app/core/dashboard/dashboard.service";
import { IDashboard } from "src/app/core/dashboard/dashboard.types";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: IUser;
  dashboard: IDashboard;
  ticketStatuses: { key: string; label: string; chipClass: string }[] = [
    { key: "Open", label: "Open", chipClass: "bg-blue-100 text-blue-800" },
    { key: "In Progress", label: "In Progress", chipClass: "bg-yellow-100 text-yellow-800" },
    { key: "Hold", label: "Hold", chipClass: "bg-orange-100 text-orange-800" },
    { key: "Vendor Dependency", label: "Vendor Dependency", chipClass: "bg-gray-100 text-gray-800" },
  ];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private _userService: UserService,
    private _dashboardService: DashboardService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      if (user != null) this.user = user;
      // Mark for check
      this._changeDetectorRef.markForCheck();
    });

    //Subscribe to Dashboard Data
    this._dashboardService.dashboard$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val: IDashboard) => {
      this.dashboard = val;
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  warrantyBellText(): string {
    const expired = this.dashboard?.assets?.assetsCountExpired?.WARRANTY || 0;
    const soon = this.dashboard?.assets?.assetsCountWithUpcommingExpireingInDays?.WARRANTY || 0;
    if (!expired && !soon) {
      return "No warranties expiring in the next 30 days";
    }

    const parts: string[] = [];
    if (expired) {
      parts.push(`${expired} ${expired === 1 ? "warranty" : "warranties"} expired`);
    }
    if (soon) {
      parts.push(`${soon} ${soon === 1 ? "expires" : "expire"} within 30 days`);
    }
    return parts.join(", ");
  }

  coverageCount(type: "WARRANTY" | "AMC"): number {
    const expired = this.dashboard?.assets?.assetsCountExpired?.[type] || 0;
    const soon = this.dashboard?.assets?.assetsCountWithUpcommingExpireingInDays?.[type] || 0;
    return expired + soon;
  }

  openCoverageList(warrantyType: "WARRANTY" | "AMC"): void {
    this._router.navigate(["/asset"], {
      queryParams: {
        expiring: true,
        expired: true,
        expiringIn: 30,
        warrantyType,
      },
    });
  }

  ticketCount(status: string): number {
    const counts = this.dashboard?.ticket?.ticketStatusCount as { [key: string]: number } | undefined;
    return counts?.[status] || 0;
  }

  statusCount(key: "IN_POOL" | "ASSIGNED" | "SCRAP" | "DOWN"): number {
    return this.dashboard?.assets?.assetStatusCount?.[key] || 0;
  }

  fleetTotal(): number {
    return (
      this.statusCount("IN_POOL") +
      this.statusCount("ASSIGNED") +
      this.statusCount("SCRAP") +
      this.statusCount("DOWN")
    );
  }

  share(key: "IN_POOL" | "ASSIGNED" | "SCRAP" | "DOWN"): number {
    const total = this.fleetTotal();
    if (!total) return 0;
    return Math.round((this.statusCount(key) / total) * 100);
  }

  donutBackground(): string {
    const total = this.fleetTotal() || 1;
    const parts: [string, number][] = [
      ["#34d399", this.statusCount("IN_POOL")],
      ["#60a5fa", this.statusCount("ASSIGNED")],
      ["#fbbf24", this.statusCount("DOWN")],
      ["#f87171", this.statusCount("SCRAP")],
    ];
    let cursor = 0;
    const stops = parts.map(([color, count]) => {
      const start = cursor;
      cursor += (count / total) * 100;
      return `${color} ${start}% ${cursor}%`;
    });
    return `conic-gradient(${stops.join(", ")})`;
  }
}
