import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";

@Component({
  selector: "app-aside",
  templateUrl: "./aside.component.html",
  styleUrls: ["./aside.component.scss"],
})
export class AsideComponent implements OnInit {
  @Input() svgIcon: string = "";
  @Input() name: string;
  @Input() routerString: string;
  @Input() isDisabled: boolean = false;
  @Input() showTip = false;
  active: boolean = false;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _router: Router) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On changes
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // Active item id

    this._markIfActive(this._router.url);
  }

  /**
   * On init
   */
  ngOnInit(): void {
    // Mark if active
    this._markIfActive(this._router.url);

    // Attach a listener to the NavigationEnd event
    this._router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe((event: NavigationEnd) => {
        // Mark if active
        this._markIfActive(event.urlAfterRedirects);
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Decide and mark if the item is active
   *
   * @private
   */
  private _markIfActive(currentUrl: string): void {
    // If the aside has a children that is active,
    // always mark it as active

    // Use exact match for routes, but also check if the current URL starts with the routerString
    // This handles cases where the route might have additional path segments
    const path = (currentUrl || "").split("?")[0].split("#")[0];
    if (this.routerString === "/asset") {
      this.active = path === "/asset" || (path.startsWith("/asset/") && !path.startsWith("/asset/scanned"));
    } else if (this.routerString === "/uam") {
      this.active = path === "/uam" || (path.startsWith("/uam/") && !path.startsWith("/uam/create"));
    } else {
      this.active = path === this.routerString || path.startsWith(this.routerString + "/");
    }
    // Mark for check
    this._changeDetectorRef.markForCheck();
  }
}
