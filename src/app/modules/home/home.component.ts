import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, combineLatest, forkJoin, of } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AccessType, ModuleTypes } from 'src/app/core/auth/permission.types';
import { PermissionService } from 'src/app/core/auth/permission.service';
import { AssetService } from 'src/app/core/asset/asset.service';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { UamService } from 'src/app/core/uam/uam.service';
import { AuditService } from 'src/app/core/audit/audit.service';
import { VendorService } from 'src/app/core/vendor/vendor.service';
import { BranchService } from 'src/app/core/branch/branch.service';
import { DepartmentService } from 'src/app/core/department/department.service';
import { UserService } from 'src/app/core/user/user.service';
import { IAsset } from 'src/app/core/asset/asset.types';
import { IUser } from 'src/app/core/user/user.types';
import { IDTO } from 'src/app/core/dto/dto.types';

interface ModuleAccess {
  module: ModuleTypes;
  accessType: AccessType;
  hasAccess: boolean;
}

interface ModuleStats {
  asset?: {
    total?: number;
    assigned?: number;
    inPool?: number;
  };
  ticket?: {
    total?: number;
    open?: number;
  };
  uam?: {
    total?: number;
    pending?: number;
  };
  audit?: {
    total?: number;
    inProgress?: number;
  };
  vendor?: {
    total?: number;
  };
  branch?: {
    total?: number;
  };
  department?: {
    total?: number;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  user: IUser;
  allocatedAssets: IAsset[] = [];
  isLoadingAssets = false;
  isLoading = true;

  // Module access observables
  moduleAccesses: ModuleAccess[] = [];
  moduleStats: ModuleStats = {};

  // Individual access observables
  assetAccess$: Observable<AccessType>;
  ticketAccess$: Observable<AccessType>;
  uamAccess$: Observable<AccessType>;
  auditAccess$: Observable<AccessType>;
  vendorAccess$: Observable<AccessType>;
  branchAccess$: Observable<AccessType>;
  departmentAccess$: Observable<AccessType>;

  // Access type enum for template
  AccessType = AccessType;
  ModuleTypes = ModuleTypes;

  constructor(
    private _permissionService: PermissionService,
    private _userService: UserService,
    private _assetService: AssetService,
    private _ticketService: TicketService,
    private _uamService: UamService,
    private _auditService: AuditService,
    private _vendorService: VendorService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef
  ) {
    // Initialize access observables
    this.assetAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.Asset);
    this.ticketAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.Ticket);
    this.uamAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.UAM);
    this.auditAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.Audit);
    this.vendorAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.Vendor);
    this.branchAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.Branch);
    this.departmentAccess$ = this._permissionService.checkCurrentUserPermission(ModuleTypes.Department);
  }

  ngOnInit(): void {
    // Subscribe to user changes
    this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      if (user) {
        this.user = user;
        this._changeDetectorRef.markForCheck();
        this.loadData();
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadData(): void {
    this.isLoading = true;

    // Check all module accesses
    combineLatest([
      this.assetAccess$,
      this.ticketAccess$,
      this.uamAccess$,
      this.auditAccess$,
      this.vendorAccess$,
      this.branchAccess$,
      this.departmentAccess$
    ]).pipe(
      takeUntil(this._unsubscribeAll),
      switchMap(([assetAccess, ticketAccess, uamAccess, auditAccess, vendorAccess, branchAccess, departmentAccess]) => {
        this.moduleAccesses = [
          { module: ModuleTypes.Asset, accessType: assetAccess, hasAccess: assetAccess !== AccessType.NoAcess },
          { module: ModuleTypes.Ticket, accessType: ticketAccess, hasAccess: ticketAccess !== AccessType.NoAcess },
          { module: ModuleTypes.UAM, accessType: uamAccess, hasAccess: uamAccess !== AccessType.NoAcess },
          { module: ModuleTypes.Audit, accessType: auditAccess, hasAccess: auditAccess !== AccessType.NoAcess },
          { module: ModuleTypes.Vendor, accessType: vendorAccess, hasAccess: vendorAccess !== AccessType.NoAcess },
          { module: ModuleTypes.Branch, accessType: branchAccess, hasAccess: branchAccess !== AccessType.NoAcess },
          { module: ModuleTypes.Department, accessType: departmentAccess, hasAccess: departmentAccess !== AccessType.NoAcess }
        ];

        // Load data for accessible modules
        const dataLoaders: Observable<any>[] = [];

        // Load asset data if user has access
        if (assetAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._assetService.getAssets(1, 1, '', '', '').pipe(
              map((response: IDTO) => {
                this.moduleStats.asset = {
                  total: response.totaldata || 0
                };
                return response;
              })
            )
          );

          // Load allocated assets for current user
          if (this.user?._id) {
            this.loadAllocatedAssets();
          }
        }

        // Load ticket data if user has access
        if (ticketAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._ticketService.getTickets(1, 1, '').pipe(
              map((response: IDTO) => {
                this.moduleStats.ticket = {
                  total: response.totaldata || 0
                };
                return response;
              })
            )
          );
        }

        // Load UAM data if user has access
        if (uamAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._uamService.getUAMS(1, 1, '').pipe(
              map((response: IDTO) => {
                this.moduleStats.uam = {
                  total: response.totaldata || 0
                };
                return response;
              })
            )
          );
        }

        // Load audit data if user has access
        if (auditAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._auditService.getAuditsPaginated(1, 1, '').pipe(
              map((response: IDTO) => {
                this.moduleStats.audit = {
                  total: response.totaldata || 0
                };
                return response;
              })
            )
          );
        }

        // Load vendor data if user has access
        if (vendorAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._vendorService.getVendors(1, 1, '').pipe(
              map((response: IDTO) => {
                this.moduleStats.vendor = {
                  total: response.totaldata || 0
                };
                return response;
              })
            )
          );
        }

        // Load branch data if user has access
        if (branchAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._branchService.getBranchs().pipe(
              map((response: IDTO) => {
                this.moduleStats.branch = {
                  total: response.totaldata || (response.data?.length || 0)
                };
                return response;
              })
            )
          );
        }

        // Load department data if user has access
        if (departmentAccess !== AccessType.NoAcess) {
          dataLoaders.push(
            this._departmentService.getDepartments().pipe(
              map((response: IDTO) => {
                this.moduleStats.department = {
                  total: response.totaldata || (response.data?.length || 0)
                };
                return response;
              })
            )
          );
        }

        if (dataLoaders.length > 0) {
          return forkJoin(dataLoaders);
        }
        return of([]);
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this._changeDetectorRef.markForCheck();
      },
      error: (err) => {
        console.error('Error loading home data:', err);
        this.isLoading = false;
        this._changeDetectorRef.markForCheck();
      }
    });
  }

  loadAllocatedAssets(): void {
    if (!this.user?._id) return;

    this.isLoadingAssets = true;
    this._assetService.getAssetsByUserId(this.user._id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (assets) => {
          this.allocatedAssets = assets || [];
          this.isLoadingAssets = false;
          this._changeDetectorRef.markForCheck();
        },
        error: (err) => {
          console.error('Error loading allocated assets:', err);
          this.isLoadingAssets = false;
          this._changeDetectorRef.markForCheck();
        }
      });
  }

  hasAccess(module: ModuleTypes): boolean {
    const moduleAccess = this.moduleAccesses.find(ma => ma.module === module);
    return moduleAccess?.hasAccess || false;
  }

  getAccessType(module: ModuleTypes): AccessType {
    const moduleAccess = this.moduleAccesses.find(ma => ma.module === module);
    return moduleAccess?.accessType || AccessType.NoAcess;
  }

  canCreate(module: ModuleTypes): boolean {
    const accessType = this.getAccessType(module);
    return accessType === AccessType.ReadWrite || accessType === AccessType.FullAccess;
  }

  navigateToModule(module: ModuleTypes): void {
    const routeMap: { [key in ModuleTypes]?: string } = {
      [ModuleTypes.Asset]: '/asset',
      [ModuleTypes.Ticket]: '/ticket',
      [ModuleTypes.UAM]: '/uam',
      [ModuleTypes.Audit]: '/audit',
      [ModuleTypes.Vendor]: '/vendor',
      [ModuleTypes.Branch]: '/branch',
      [ModuleTypes.Department]: '/department'
    };

    const route = routeMap[module];
    if (route) {
      this._router.navigate([route]);
    }
  }

  navigateToCreate(module: ModuleTypes): void {
    const routeMap: { [key in ModuleTypes]?: string } = {
      [ModuleTypes.Asset]: '/asset/create',
      [ModuleTypes.Ticket]: '/ticket/create',
      [ModuleTypes.UAM]: '/uam/create',
      [ModuleTypes.Audit]: '/audit/create',
      [ModuleTypes.Vendor]: '/vendor/create',
      [ModuleTypes.Branch]: '/branch/create',
      [ModuleTypes.Department]: '/department/create'
    };

    const route = routeMap[module];
    if (route) {
      this._router.navigate([route]);
    }
  }

  openAssetDetail(asset: IAsset): void {
    if (asset._id) {
      this._router.navigate([`/asset/${asset._id}`]);
    }
  }

  getAssetDisplayName(asset: IAsset): string {
    if (asset.type === 'laptop' || asset.type === 'server' || asset.type === 'pc') {
      return (asset as any)[asset.type]?.system?.model || asset.name || 'Unknown';
    }
    return asset.name || asset.assetCode || 'Unknown';
  }

  getAssetSerialNumber(asset: IAsset): string {
    if (asset.type === 'laptop' || asset.type === 'server' || asset.type === 'pc') {
      return (asset as any)[asset.type]?.system?.serial || asset.sr_no || '-';
    }
    return asset.sr_no || '-';
  }

  getAssetType(asset: IAsset): string {
    return asset.type ? asset.type.charAt(0).toUpperCase() + asset.type.slice(1) : '-';
  }

  getModuleDisplayName(module: ModuleTypes): string {
    const displayNames: { [key in ModuleTypes]: string } = {
      [ModuleTypes.Asset]: 'Assets',
      [ModuleTypes.Ticket]: 'Tickets',
      [ModuleTypes.UAM]: 'User Access Management',
      [ModuleTypes.Audit]: 'Audits',
      [ModuleTypes.Vendor]: 'Vendors',
      [ModuleTypes.Branch]: 'Branches',
      [ModuleTypes.Department]: 'Departments',
      [ModuleTypes.User]: 'Users',
      [ModuleTypes.Report]: 'Reports'
    };
    return displayNames[module] || module;
  }

  getModuleIcon(module: ModuleTypes): string {
    const iconMap: { [key in ModuleTypes]: string } = {
      [ModuleTypes.Asset]: 'heroicons_outline:archive',
      [ModuleTypes.Ticket]: 'heroicons_outline:ticket',
      [ModuleTypes.UAM]: 'heroicons_outline:key',
      [ModuleTypes.Audit]: 'heroicons_outline:clipboard-check',
      [ModuleTypes.Vendor]: 'heroicons_outline:office-building',
      [ModuleTypes.Branch]: 'heroicons_outline:map',
      [ModuleTypes.Department]: 'heroicons_outline:building-office',
      [ModuleTypes.User]: 'heroicons_outline:users',
      [ModuleTypes.Report]: 'heroicons_outline:document-chart-bar'
    };
    return iconMap[module] || 'heroicons_outline:cube';
  }

  hasAnyAccess(): boolean {
    if (!this.moduleAccesses || this.moduleAccesses.length === 0) {
      return false;
    }
    return this.moduleAccesses.some(ma => ma.hasAccess);
  }
}
