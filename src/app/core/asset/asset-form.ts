import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { IDisk, IWarranty } from "./asset.types";

export class AssetForm
{
   constructor() { }
   public static WarrantyForm(warranty: IWarranty = null)
   {
      return new FormGroup({
         name: new FormControl(warranty?.name ?? "", [Validators.required]),
         description: new FormControl(warranty?.description ?? ""),
         type: new FormControl(warranty?.type ?? "WARRANTY"),
         warrantySiteType: new FormControl(warranty?.warrantySiteType ?? "ON_SITE"),
         startAt: new FormControl(warranty?.startAt ?? moment().toISOString(), [Validators.required],),
         endAt: new FormControl(warranty?.endAt ?? '', [Validators.required]),
         purchaseDate: new FormControl(warranty?.purchaseDate ?? moment().toISOString(), [Validators.required]),
         vendor: new FormControl(warranty?.vendor ?? "", [Validators.required]),
         poNumber: new FormControl(warranty?.poNumber ?? ""),
      });
   }

   public static DiskFormGroup(diskLayout: IDisk = null)
   {
      return new FormGroup({
         device: new FormControl(diskLayout?.device ?? "disk0"),
         type: new FormControl(diskLayout?.type ?? "HDD"), // NVMe,..
         name: new FormControl(diskLayout?.name ?? ""), //"INTEL SSDPEKNW512G8"
         vendor: new FormControl(diskLayout?.vendor ?? ""), // INTEL
         size: new FormControl(diskLayout?.size ?? 0, [Validators.required, Validators.pattern("^([1-9][0-9]*)$")]),
      });
   }
}
