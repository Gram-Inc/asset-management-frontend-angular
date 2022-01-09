import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Observable, Subject } from "rxjs";
import { debounceTime, map, switchMap, takeUntil } from "rxjs/operators";
import { IPagination } from "src/app/core/asset/asset.types";
import { TicketService } from "src/app/core/ticket/ticket.service";
import { ITicket } from "src/app/core/ticket/ticket.types";
@Component({
  selector: "app-ticket",
  templateUrl: "./ticket.component.html",
  styleUrls: ["./ticket.component.scss"],
})
export class TicketComponent implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  tickets$: Observable<ITicket[]>;
  types: string[];
  pagination: IPagination;
  flashMessage: "success" | "error" | null = null;

  isLoading: boolean = false;
  searchCtrl: FormControl = new FormControl("");

  constructor(private _ticketService: TicketService) {}

  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.isLoading = true;
          return this._ticketService.getTickets(1, 10, query);
        }),
        map(() => {
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
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}