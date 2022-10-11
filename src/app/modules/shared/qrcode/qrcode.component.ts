import
{
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
import { QrService } from "src/app/core/qr/qr.service";
@Component({
   selector: "app-qrcode",
   templateUrl: "./qrcode.component.html",
})
export class QrcodeComponent implements OnInit
{
   src;
   @Input("id") id;
   constructor(private _changeDetectorRef: ChangeDetectorRef, private _qrService: QrService) { }

   async ngOnInit()
   {
      try
      {
         this.src = await QRCode.toDataURL(this.id, { errorCorrectionLevel: "M" });
         this._changeDetectorRef.detectChanges();
      } catch (err)
      {
         console.error(err);
      }
   }

   //Print QR
   async printQR()
   {
      this._qrService.printQR(this.id ?? "");
   }
}
