import { IUser } from "../../user/user.types";
import { Baseboard, CPU, IDisk, LaptopBattery, Mem, MemLayout, OS, System } from "../asset.types";

export interface IScannedAsset {
  _id?: string;
  user?: string | IUser;
  system?: Partial<System>;
  os?: Partial<OS>;
  mem?: Partial<Mem>;
  memLayout?: Partial<MemLayout>[];
  battery?: Partial<LaptopBattery>;
  baseboard?: Partial<Baseboard>;
  cpu?: Partial<CPU>;
  diskLayout?: Partial<IDisk[]>;
}
