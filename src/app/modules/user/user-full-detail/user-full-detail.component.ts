import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, forkJoin } from "rxjs";
import { takeUntil, switchMap } from "rxjs/operators";
import { UserService } from "src/app/core/user/user.service";
import { IUser } from "src/app/core/user/user.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { TicketService } from "src/app/core/ticket/ticket.service";
import { UamService } from "src/app/core/uam/uam.service";
import { TicketStatus } from "src/app/core/ticket/ticket.types";

@Component({
  selector: "app-user-full-detail",
  templateUrl: "./user-full-detail.component.html",
  styleUrls: ["./user-full-detail.component.scss"],
})
export class UserFullDetailComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user: IUser;
  features = ModuleTypes;
  accessTypes = AccessType;

  // Ticket counts
  openTicketsCount: number = 0;
  completedTicketsCount: number = 0;

  // UAM counts
  openUAMCount: number = 0;
  completedUAMCount: number = 0;

  constructor(
    private _userService: UserService,
    public permissionService: PermissionService,
    private _ticketService: TicketService,
    private _uamService: UamService
  ) {}

  ngOnInit(): void {
    this._userService.selectedUser$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) => {
      if (val) {
        this.user = val;
        this.loadUserStatistics();
      }
    });
  }

  loadUserStatistics(): void {
    if (!this.user || !this.user._id) return;

    // Load tickets and UAMs for this user
    forkJoin({
      tickets: this._ticketService.getTickets(1, 1000, ""), // Get all tickets (large limit)
      uams: this._uamService.getUAMS(1, 1000, ""), // Get all UAMs (large limit)
    })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: ({ tickets, uams }) => {
          // Count tickets by status
          const userTickets = (tickets.data || []).filter(
            (ticket: any) =>
              ticket.requestFromUserId?._id === this.user._id ||
              ticket.requestFromUserId === this.user._id ||
              ticket.assignedToUserId?._id === this.user._id ||
              ticket.assignedToUserId === this.user._id
          );

          this.openTicketsCount = userTickets.filter(
            (t: any) => t.callStatus === TicketStatus.Open || t.callStatus === "Open"
          ).length;

          this.completedTicketsCount = userTickets.filter(
            (t: any) => t.callStatus === TicketStatus.Closed || t.callStatus === "Closed"
          ).length;

          // Count UAMs by status
          const userUAMs = (uams.data || []).filter(
            (uam: any) =>
              uam.createdBy?._id === this.user._id || uam.createdBy === this.user._id
          );

          // UAM statuses: "Open", "Approved", "Rejected", "Completed", etc.
          this.openUAMCount = userUAMs.filter(
            (u: any) => u.status === "Open" || u.status === "Pending" || !u.status
          ).length;

          this.completedUAMCount = userUAMs.filter(
            (u: any) => u.status === "Approved" || u.status === "Completed"
          ).length;
        },
        error: (err) => {
          console.error("Error loading user statistics:", err);
        },
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getDepartmentName(user: IUser) {
    if (user.departmentId && typeof user.departmentId == "object") return user.departmentId.name;
    return "-";
  }
  getUserLevel(user: IUser) {
    if (user.role == "level1") return "Level 1";
    else if (user.role == "level2") return "Level 2";
    else return "Level 3";
  }

  getAccessPolicy(module: ModuleTypes): AccessType {
    if (!this.user || !this.user.permissions) {
      return AccessType.NoAcess;
    }
    return this.permissionService.checkPermission(this.user.permissions, module);
  }

  getModuleDisplayName(module: ModuleTypes): string {
    const displayNames: { [key: string]: string } = {
      [ModuleTypes.User]: "User",
      [ModuleTypes.UAM]: "U.A.M",
      [ModuleTypes.Asset]: "Asset",
      [ModuleTypes.Ticket]: "Ticket",
      [ModuleTypes.Vendor]: "Vendor",
      [ModuleTypes.Branch]: "Branch",
      [ModuleTypes.Department]: "Department",
      [ModuleTypes.Audit]: "Audit",
      [ModuleTypes.Report]: "Report",
    };
    return displayNames[module] || module;
  }

  getModulesToDisplay(): ModuleTypes[] {
    // Return all modules that should be displayed
    return [
      ModuleTypes.User,
      ModuleTypes.UAM,
      ModuleTypes.Asset,
      ModuleTypes.Ticket,
      ModuleTypes.Vendor,
      ModuleTypes.Branch,
      ModuleTypes.Department,
      ModuleTypes.Audit,
    ];
  }

  hasAllocatedAssets(): boolean {
    if (!this.user || !this.user.allocatedAssets) return false;
    if (Array.isArray(this.user.allocatedAssets)) {
      return this.user.allocatedAssets.length > 0;
    }
    // If it's a string, consider it as having assets
    return !!this.user.allocatedAssets;
  }
}
