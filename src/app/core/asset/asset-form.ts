import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from "@angular/forms";
import * as moment from "moment";
import { IDisk, IWarranty } from "./asset.types";

export class AssetForm
{
   constructor() { }
   public static WarrantyForm(warranty: IWarranty = null)
   {
      return new UntypedFormGroup({
         name: new UntypedFormControl(warranty?.name ?? "", [Validators.required]),
         description: new UntypedFormControl(warranty?.description ?? ""),
         type: new UntypedFormControl(warranty?.type ?? "WARRANTY"),
         warrantySiteType: new UntypedFormControl(warranty?.warrantySiteType ?? "ON_SITE"),
         startAt: new UntypedFormControl(warranty?.startAt ?? moment().toISOString(), [Validators.required],),
         endAt: new UntypedFormControl(warranty?.endAt ?? '', [Validators.required]),
         purchaseDate: new UntypedFormControl(warranty?.purchaseDate ?? moment().toISOString(), [Validators.required]),
         vendor: new UntypedFormControl(warranty?.vendor ?? "", [Validators.required]),
         poNumber: new UntypedFormControl(warranty?.poNumber ?? ""),
      });
   }

   public static DiskFormGroup(diskLayout: IDisk = null)
   {
      return new UntypedFormGroup({
         device: new UntypedFormControl(diskLayout?.device ?? "disk0"),
         type: new UntypedFormControl(diskLayout?.type ?? "HDD"), // NVMe,..
         name: new UntypedFormControl(diskLayout?.name ?? ""), //"INTEL SSDPEKNW512G8"
         vendor: new UntypedFormControl(diskLayout?.vendor ?? ""), // INTEL
         size: new UntypedFormControl(diskLayout?.size ?? 0, [Validators.required, Validators.pattern("^([1-9][0-9]*)$")]),
      });
   }
}
