import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, UntypedFormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable, combineLatest, of, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { PermissionService } from "src/app/core/auth/permission.service";
import { AccessType, ModuleTypes } from "src/app/core/auth/permission.types";
import { ReportService } from "src/app/core/report/report.service";
import { TicketService } from "src/app/core/ticket/ticket.service";
import { ITicket } from "src/app/core/ticket/ticket.types";
import { UserService } from "src/app/core/user/user.service";
@Component({
   selector: "app-ticket",
   templateUrl: "./ticket.component.html",
   styleUrls: ["./ticket.component.scss"],
})
export class TicketComponent implements OnInit, OnDestroy
{
   private _unsubscribeAll: Subject<any> = new Subject<any>();
   tickets$: Observable<ITicket[]>;
   types: string[];
   pagination: IPagination;
   flashMessage: "success" | "error" | null = null;

   isLoading: boolean = false;
   searchCtrl: UntypedFormControl = new UntypedFormControl("");

   constructor(private _ticketService: TicketService,
      private _permissionService: PermissionService,
      private _userService: UserService,
      private _reportService: ReportService,
      private _snackBar: MatSnackBar) { }

   ngOnInit(): void
   {
      this.searchCtrl.valueChanges
         .pipe(
            takeUntil(this._unsubscribeAll),
            debounceTime(300),
            switchMap((query) =>
            {
               this.isLoading = true;
               return this._ticketService.getTickets(1, 10, query);
            }),
            map(() =>
            {
               this.isLoading = false;
            })
         )
         .subscribe();

      // Get the Assets
      this.tickets$ = this._ticketService.tickets$;
   }

   /**
    * On destroy
    */
   ngOnDestroy(): void
   {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next();
      this._unsubscribeAll.complete();
   }

   /**
   *
   * Font View Manipulators ------Permissions
   */
   canExport(): Observable<boolean>
   {
      return combineLatest([
         this._permissionService.checkCurrentUserPermission(ModuleTypes.Ticket),
         this._userService.user$,
      ]).pipe(
         map(([value, user]) =>
         {
            const canView = value == AccessType.Read || value == AccessType.ReadWrite || value == AccessType.FullAccess;
            return canView && (user?.role == "level1" || user?.role == "level2");
         })
      );
   }

   exportCsv(): void
   {
      this._reportService.download("tickets", {
         searchText: this.searchCtrl.value || "",
      }).subscribe({
         error: () => this._snackBar.open("Could not export tickets", "Close", { duration: 3000 }),
      });
   }

   canCreate(): Observable<boolean>
   {
      return this._permissionService.checkCurrentUserPermission(ModuleTypes.Ticket).pipe(
         switchMap(value =>
         {
            //User should be able to Create only if He has Readwrite or full access
            if (value == AccessType.ReadWrite || value == AccessType.FullAccess) return of(true);
            return of(false);
         })
      );
   }
}
