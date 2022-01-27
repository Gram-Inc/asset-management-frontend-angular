import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingService } from "./loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private _loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Set the loading status to true
    this._loadingService._setLoadingStatus(true, request.url);

    return next.handle(request).pipe(
      finalize(() => {
        // Set the status to false if there are any errors or the request is completed
        this._loadingService._setLoadingStatus(false, request.url);
      })
    );
  }
}
