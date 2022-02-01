import
   {
      AfterViewInit,
      ChangeDetectorRef,
      Component,
      OnChanges,
      OnDestroy,
      OnInit,
      SimpleChanges,
      ViewChild,
   } from "@angular/core";
import { MatDrawer, MatDrawerMode } from "@angular/material/sidenav";
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
   @ViewChild("drawer") public drawer: MatDrawer;

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
         });

      this._modeService.mode$.pipe(takeUntil(this._unsubscribeAll)).subscribe((val) =>
      {
         this.mode = val;
      });

      // this._userService.user$.pipe(takeUntil(this._unsubscribeAll)).subscribe((user: IUser) => {
      //   this.user = user;
      // });
      this.user$ = this._userService.user$;
   }
   ngOnDestroy()
   {
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }
   ngAfterViewInit(): void
   {
      this._modeService.setDrawer(this.drawer);
   }
   toggleDrawer()
   {
      this.drawer.toggle();
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
