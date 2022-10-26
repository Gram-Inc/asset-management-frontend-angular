import
{
   AfterViewInit,
   ChangeDetectorRef,
   Component,
   OnDestroy,
   OnInit,
   ViewChild,
   ViewEncapsulation,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { merge, Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { TicketService } from "src/app/core/ticket/ticket.service";
import { ITicket } from "src/app/core/ticket/ticket.types";
import { RikielConfirmationService } from "src/app/custom/confirmation/confirmation.service";

@Component({
   selector: "ticket-list",
   templateUrl: "./ticket-list.component.html",
   styleUrls: ["./ticket-list.component.scss"],
})
export class TicketListComponent implements OnInit
{
   @ViewChild(MatPaginator) private _paginator: MatPaginator;
   @ViewChild(MatSort) private _sort: MatSort;

   private _unsubscribeAll: Subject<any> = new Subject<any>();
   tickets$: Observable<ITicket[]>;
   types: string[];
   pagination: IPagination;
   selectedAsset: ITicket | null = null;
   flashMessage: "success" | "error" | null = null;

   isLoading: boolean = false;
   searchCtrl: FormControl = new FormControl("");

   constructor(
      private _ticketService: TicketService,
      private _formBuilder: FormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _rikielConfirmationService: RikielConfirmationService,
      private _matDialog: MatDialog
   ) { }

   ngOnInit(): void
   {
      // If Search value changes
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

      this._ticketService.pagination$
         .pipe(takeUntil(this._unsubscribeAll))
         .subscribe((paginationResponse: IPagination) => (this.pagination = paginationResponse));
   }

   ngAfterViewInit(): void
   {
      if (this._sort && this._paginator)
      {
         // Set the initial sort
         /* this._sort.sort({
           id: "name",
           start: "asc",
           disableClear: true,
         }); */

         // Mark for check
         this._changeDetectorRef.markForCheck();

         // If the ticket changes the sort order...
         this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() =>
         {
            // Reset back to the first page
            this._paginator.pageIndex = 0;
         });

         // Get products if sort or page changes
         merge(this._sort.sortChange, this._paginator.page)
            .pipe(
               switchMap(() =>
               {
                  this.isLoading = true;
                  return this._ticketService.getTickets(
                     this._paginator.pageIndex,
                     this._paginator.pageSize
                     /* "",
                     "",
                     "",
                     this._sort.direction,
                     this._sort.active */
                  );
               }),
               map(() =>
               {
                  this.isLoading = false;
               })
            )
            .subscribe();
      }
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

   openDetail(ast: ITicket)
   {
      //Open Ticket Detail Page
   }
   /**
    * Show flash message
    */
   showFlashMessage(type: "success" | "error"): void
   {
      // Show the message
      this.flashMessage = type;

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // Hide it after 3 seconds
      setTimeout(() =>
      {
         this.flashMessage = null;

         // Mark for check
         this._changeDetectorRef.markForCheck();
      }, 3000);
   }

   /**
    * Track by function for ngFor loops
    *
    * @param index
    * @param item
    */
   trackByFn(index: number, item: any): any
   {
      return item._id || index;
   }

   // Check For Branch Code
   getBranchShortCode(obj: any)
   {
      if (obj) return typeof obj === "object" ? obj.branchCode : "-";
      return "NULL";
   }
   getTicketName(ticket: ITicket) { }
   getDepartmentCode(ticket: ITicket)
   {
      // if (ticket.departmentId && typeof ticket.departmentId == "object") return ticket.departmentId.name;
      // return "-";
   }
   getTrimmedWork(word: string)
   {
      if (word.length > 55) return word.substring(0, 55) + '...'
      return word;
   }
}
