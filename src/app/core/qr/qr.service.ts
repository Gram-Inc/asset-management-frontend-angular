import { Injectable } from "@angular/core";
import * as QRCode from "qrcode";

@Injectable({
  providedIn: "root",
})
export class QrService {
  constructor() {}

  //Print QR
  async printQR(id: string) {
    window.open(await QRCode.toDataURL(id, { errorCorrectionLevel: "M" }));
  }
}
