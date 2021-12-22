import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
// var QRCode = require("qrcode");
import * as QRCode from "qrcode";
@Component({
  selector: "app-qrcode",
  templateUrl: "./qrcode.component.html",
})
export class QrcodeComponent implements OnInit {
  src;
  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.src = await QRCode.toDataURL("txvdfdext", { errorCorrectionLevel: "Q" });
      this._changeDetectorRef.detectChanges();
    } catch (err) {
      console.error(err);
    }
  }
}
