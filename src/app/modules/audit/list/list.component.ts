import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { UntypedFormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Router } from "@angular/router";
import { merge, Observable, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil, tap } from "rxjs/operators";
import { AuditService } from "src/app/core/audit/audit.service";
import { IAudit, IPagination, AuditStatus } from "src/app/core/audit/audit.types";
import { BranchService } from "src/app/core/branch/branch.service";
import { DepartmentService } from "src/app/core/department/department.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { IDepartment } from "src/app/core/department/department.types";

@Component({
  selector: "app-audit-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.scss"],
})
export class AuditListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  audits$: Observable<IAudit[]>;
  pagination: IPagination;
  isLoading: boolean = false;
  searchCtrl: UntypedFormControl = new UntypedFormControl("");
  statusFilter: UntypedFormControl = new UntypedFormControl("");
  branchFilter: UntypedFormControl = new UntypedFormControl("");
  departmentFilter: UntypedFormControl = new UntypedFormControl("");

  branches: IBranch[] = [];
  departments: IDepartment[] = [];
  statusOptions = [
    { value: "", label: "All" },
    { value: AuditStatus.OPEN, label: "Open" },
    { value: AuditStatus.IN_PROGRESS, label: "In Progress" },
    { value: AuditStatus.COMPLETED, label: "Completed" },
    { value: AuditStatus.CLOSED, label: "Closed" },
  ];

  constructor(
    private _auditService: AuditService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
    private _branchService: BranchService,
    private _departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    // Load branches and departments for filters
    this._branchService.getBranchs().subscribe((response) => {
      this.branches = response.data || [];
    });
    this._departmentService.getDepartments().subscribe((response) => {
      this.departments = response.data || [];
    });

    // Get audits - subscribe to load initial data
    this.isLoading = true;
    this.loadAudits()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        },
        error: () => {
          this.isLoading = false;
          this._changeDetectorRef.markForCheck();
        },
      });
  }

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      // Search control changes
      this.searchCtrl.valueChanges
        .pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(300),
          switchMap(() => {
            this.isLoading = true;
            return this.loadAudits();
          }),
          map(() => {
            this.isLoading = false;
          })
        )
        .subscribe();

      // Filter changes
      merge(
        this.statusFilter.valueChanges,
        this.branchFilter.valueChanges,
        this.departmentFilter.valueChanges
      )
        .pipe(
          takeUntil(this._unsubscribeAll),
          debounceTime(300),
          switchMap(() => {
            this.isLoading = true;
            this._paginator.pageIndex = 0;
            return this.loadAudits();
          }),
          map(() => {
            this.isLoading = false;
          })
        )
        .subscribe();

      // Sort and pagination changes
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          takeUntil(this._unsubscribeAll),
          switchMap(() => {
            this.isLoading = true;
            return this.loadAudits();
          }),
          map(() => {
            this.isLoading = false;
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadAudits(): Observable<any> {
    return this._auditService
      .getAuditsPaginated(
        (this._paginator?.pageIndex || 0) + 1,
        this._paginator?.pageSize || 10,
        this.searchCtrl.value || "",
        this.statusFilter.value || undefined,
        this.branchFilter.value || undefined,
        this.departmentFilter.value || undefined
      )
      .pipe(
        tap((response: any) => {
          // Update audits observable
          this.audits$ = of(response.data || []);

          // Update pagination
          this.pagination = {
            limit: response.limit,
            page: response.page - 1,
            totalPage: response.totalPage,
            totalData: response.totaldata || response.totalData || 0,
          };

          this._changeDetectorRef.markForCheck();
        })
      );
  }

  getProgressPercentage(audit: IAudit): number {
    if (!audit.totalAssets || audit.totalAssets === 0) return 0;
    return Math.round((audit.scannedAssets / audit.totalAssets) * 100);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case AuditStatus.OPEN:
        return "bg-blue-100 text-blue-800";
      case AuditStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case AuditStatus.COMPLETED:
        return "bg-green-100 text-green-800";
      case AuditStatus.CLOSED:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  viewAudit(audit: IAudit): void {
    this._router.navigate([`/audit/${audit._id}`]);
  }

  createAudit(): void {
    this._router.navigate(["/audit/create"]);
  }

  completeAudit(audit: IAudit, event: Event): void {
    event.stopPropagation();
    if (audit.isClosed) return;

    // Show confirmation if there are unscanned assets
    const unscanned = (audit.totalAssets || 0) - (audit.scannedAssets || 0);
    if (unscanned > 0) {
      const confirmed = confirm(
        `There are ${unscanned} unscanned assets. Do you want to mark them as missing and complete the audit?`
      );
      if (!confirmed) return;
    }

    this._auditService
      .completeAudit(audit._id!, { forceComplete: true })
      .subscribe(() => {
        this.loadAudits().subscribe();
      });
  }

  getDepartmentNames(audit: IAudit): string {
    if (!audit.departmentIds || audit.departmentIds.length === 0) return "-";
    const depts = audit.departmentIds.map((dept: any) =>
      typeof dept === "object" ? dept.name : dept
    );
    return depts.join(", ");
  }

  getBranchName(audit: IAudit): string {
    if (!audit.branchId) return "-";
    return typeof audit.branchId === "object"
      ? audit.branchId.name || "-"
      : "-";
  }

  trackByFn(index: number, item: any): any {
    return item._id || index;
  }
}
