import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, take } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  private _show$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private _urlMap: Map<string, boolean> = new Map<string, boolean>();

  constructor(@Inject(DOCUMENT) private _document: any, private _router: Router) {
    // Hide it on the first NavigationEnd event
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        take(1)
      )
      .subscribe(() => {
        this.hide();
      });
  }
  /**
   * Getter for show
   */
  get show$(): Observable<boolean> {
    return this._show$.asObservable();
  }
  /**
   * Sets the loading status on the given url
   *
   * @param status
   * @param url
   */
  _setLoadingStatus(status: boolean, url: string): void {
    // Return if the url was not provided
    if (!url) {
      console.error("The request URL must be provided!");
      return;
    }

    if (status === true) {
      this._urlMap.set(url, status);
      this._show$.next(true);
    } else if (status === false && this._urlMap.has(url)) {
      this._urlMap.delete(url);
    }

    // Only set the status to 'false' if all outgoing requests are completed
    if (this._urlMap.size === 0) {
      this._show$.next(false);
    }
  }

  /**
   * Show the splash screen
   */
  show(): void {
    console.log("Starting");
    this._document.body.classList.remove("rikiel-splash-screen-hidden");
  }
  /**
   * Hide the splash screen
   */
  hide(): void {
    console.log("Naviagtion remove Spalash");
    this._document.body.classList.add("rikiel-splash-screen-hidden");
  }
}
