import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
// var QRCode = require("qrcode");
import * as QRCode from "qrcode";
@Component({
  selector: "app-qrcode",
  templateUrl: "./qrcode.component.html",
})
export class QrcodeComponent implements OnInit {
  src;
  @Input("id") id;
  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.src = await QRCode.toDataURL(this.id, { errorCorrectionLevel: "M" });
      this._changeDetectorRef.detectChanges();
    } catch (err) {
      console.error(err);
    }
  }

  //Print QR
  async printQR() {
    window.open(await QRCode.toDataURL(this.id, { errorCorrectionLevel: "M" }));
  }
}
