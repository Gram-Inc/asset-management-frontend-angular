import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

export type ReportKind = "assets" | "tickets" | "users";

@Injectable({
   providedIn: "root",
})
export class ReportService
{
   private _baseUrl = environment.baseUrl;

   constructor(private _httpClient: HttpClient) { }

   download(kind: ReportKind, params: Record<string, string> = {}): Observable<void>
   {
      const query: Record<string, string> = {};
      Object.keys(params).forEach((key) =>
      {
         if (params[key])
         {
            query[key] = params[key];
         }
      });

      return this._httpClient
         .get(`${this._baseUrl}/reports/${kind}`, {
            params: query,
            responseType: "blob",
            observe: "response",
         })
         .pipe(
            tap((response) => this.saveFile(response, `${kind}.csv`)),
            map(() => undefined)
         );
   }

   private saveFile(response: HttpResponse<Blob>, fallbackName: string): void
   {
      const blob = response.body;
      if (!blob)
      {
         return;
      }
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = this.filename(response.headers.get("content-disposition"), fallbackName);
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(url);
   }

   private filename(disposition: string | null, fallbackName: string): string
   {
      const match = disposition && /filename="?([^"]+)"?/.exec(disposition);
      return match ? match[1] : fallbackName;
   }
}
