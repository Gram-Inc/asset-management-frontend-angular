import
{
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   HostBinding,
   HostListener,
   OnChanges,
   OnDestroy,
   OnInit,
   SimpleChanges,
   ViewChild,
} from "@angular/core";
import { MatDrawer, MatDrawerContainer, MatDrawerMode } from "@angular/material/sidenav";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { Observable, of, Subject } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";
import { AuthService } from "../core/auth/auth.service";
import { PermissionService } from "../core/auth/permission.service";
import { AccessType, ModuleTypes } from "../core/auth/permission.types";
import { SideNavService } from "../core/side-nav/side-nav.service";
import { UserService } from "../core/user/user.service";
import { IUser } from "../core/user/user.types";

@Component({
   selector: "layout",
   templateUrl: "./layout.component.html",
   styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
   user$: Observable<IUser> = undefined;
   mode: MatDrawerMode = "side";
   pageTitle = "Overview";
   navExpanded = false;
   assetMenuOpen = false;
   uamMenuOpen = false;
   @ViewChild("drawer") public drawer: MatDrawer;
   @ViewChild(MatDrawerContainer) private drawerContainer: MatDrawerContainer;

   private _unsubscribeAll: Subject<any> = new Subject<any>();
   constructor(
      private _userService: UserService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _modeService: SideNavService,
      private _router: Router,
      private _authService: AuthService,
      private _permissionService: PermissionService
   ) { }
   //c
   ngOnChanges(changes: SimpleChanges): void
   {
      if (this._router.isActive("/uam/create", false)) this.drawer.opened = false;
   }
   ngOnInit(): void
   {
      // Attach a listener to the NavigationEnd event
      this._router.events
         .pipe(
            filter((event): event is NavigationEnd => event instanceof NavigationEnd),
            takeUntil(this._unsubscribeAll)
         )
         .subscribe((event: NavigationEnd) =>
         {
            // Mark if active
            if (this._router.isActive("/uam/create", false)) this.drawer.opened = false;
            this.setPageTitle(event.urlAfterRedirects);
         });

      this._modeService.mode$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.mode = val;
      });

      // this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      //   this.user = user;
      // });
      this.user$ = this._userService.user$;
      this.navExpanded = localStorage.getItem("ah-nav-expanded") === "1";
      this.setPageTitle(this._router.url);
      this.applyDrawerMode();
   }
   ngOnDestroy()
   {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }
   ngAfterViewInit(): void
   {
      this._modeService.setDrawer(this.drawer);
      this.applyDrawerMode();
      this.drawer.openedChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() =>
      {
         this._changeDetectorRef.markForCheck();
      });
      this._changeDetectorRef.detectChanges();
   }

   @HostListener("window:resize")
   onResize(): void
   {
      this.applyDrawerMode();
   }

   private lastNarrow: boolean | null = null;

   private applyDrawerMode(): void
   {
      const narrow = window.innerWidth < 960;
      this.mode = narrow ? "over" : "side";
      if (!this.drawer) return;
      this.drawer.mode = this.mode;
      if (this.lastNarrow === narrow) return;
      this.lastNarrow = narrow;
      if (narrow) this.drawer.close();
      else this.drawer.open();
   }

   toggleDrawer()
   {
      this.drawer.toggle();
   }

   @HostBinding("class.nav-open")
   get navOpen(): boolean
   {
      return this.mode !== "over" && this.navExpanded && !!this.drawer?.opened;
   }

   @HostBinding("class.nav-collapsed")
   get navCollapsed(): boolean
   {
      return this.mode !== "over" && !this.navExpanded && !!this.drawer?.opened;
   }

   get showLabels(): boolean
   {
      return this.mode === "over" || this.navExpanded;
   }

   toggleNav(): void
   {
      this.navExpanded = !this.navExpanded;
      localStorage.setItem("ah-nav-expanded", this.navExpanded ? "1" : "0");
      requestAnimationFrame(() => this.drawerContainer?.updateContentMargins());
   }

   sectionActive(prefix: string): boolean
   {
      const path = this.currentPath();
      return path === prefix || path.startsWith(prefix + "/");
   }

   isAssetManage(): boolean
   {
      const path = this.currentPath();
      return path === "/asset" || (path.startsWith("/asset/") && !path.startsWith("/asset/scanned"));
   }

   isAssetScanned(): boolean
   {
      return this.currentPath().startsWith("/asset/scanned");
   }

   isUamManage(): boolean
   {
      const path = this.currentPath();
      return path === "/uam" || (path.startsWith("/uam/") && !path.startsWith("/uam/create"));
   }

   isUamCreate(): boolean
   {
      return this.currentPath().startsWith("/uam/create");
   }

   private setPageTitle(url: string): void
   {
      const path = (url || "").split("?")[0].split("#")[0];
      if (path.startsWith("/asset")) this.assetMenuOpen = true;
      if (path.startsWith("/uam")) this.uamMenuOpen = true;
      if (path.startsWith("/dashboard")) this.pageTitle = "Overview";
      else if (path.startsWith("/home")) this.pageTitle = "Home";
      else if (path.startsWith("/asset/scanned")) this.pageTitle = "Scanned";
      else if (path.startsWith("/asset")) this.pageTitle = "Assets";
      else if (path.startsWith("/ticket")) this.pageTitle = "Tickets";
      else if (path.startsWith("/uam/create")) this.pageTitle = "New request";
      else if (path.startsWith("/uam")) this.pageTitle = "Access";
      else if (path.startsWith("/audit")) this.pageTitle = "Audit";
      else if (path.startsWith("/user")) this.pageTitle = "People";
      else if (path.startsWith("/vendor")) this.pageTitle = "Vendors";
      else if (path.startsWith("/branch")) this.pageTitle = "Branches";
      else if (path.startsWith("/department")) this.pageTitle = "Departments";
      else if (path.startsWith("/report")) this.pageTitle = "Reports";
      else this.pageTitle = "Asset Hub";
      this._changeDetectorRef.markForCheck();
   }

   private currentPath(): string
   {
      return (this._router.url || "").split("?")[0].split("#")[0];
   }

   checkTicket()
   {
      return this._authService.checkTicket();
   }
   checkUAM()
   {
      return this._authService.checkUAM();
   }
   checkAsset()
   {
      return this._authService.checkAsset();
   }
   checkLevel(level: 'level1' | 'level2' | 'level3')
   {
      return this._authService.checkRole(level);
   }
   checkUser()
   {
      return this._authService.checkUser();
   }
   checkVendor()
   {
      return this._authService.checkVendor();
   }
   checkBranch()
   {
      return this._authService.checkBranch();
   }
   checkDepartment()
   {
      return this._authService.checkDepartment();
   }
   checkAudit()
   {
      return this._authService.checkAudit();
   }
   checkReport()
   {
      return this._authService.checkReport();
   }
   checkSetting()
   {
      return this._authService.checkSetting();
   }
   canCreateUAM()
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.UAM).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
