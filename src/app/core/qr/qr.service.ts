import { Injectable } from "@angular/core";
import * as QRCode from "qrcode";

@Injectable({
   providedIn: "root",
})
export class QrService
{
   constructor() { }

   //Print QR
   async printQR(id: string)
   {
      let qr = await QRCode.toDataURL(id, { errorCorrectionLevel: "M" })
      var iframe = "<iframe src='" + qr + "' frameborder='0' style='border: 0; top: 0px; left: 0px; bottom: 0px; right: 0px; ' allowfullscreen></iframe></iframe>"
      var x = window.open();
      x.document.open();
      x.document.write(iframe);
      x.document.close();

      // debugger
      // window.open(qr);
   }
}
