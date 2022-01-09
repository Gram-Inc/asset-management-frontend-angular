import { Component, Input, OnInit } from "@angular/core";
import { IAsset } from "src/app/core/asset/asset.types";

@Component({
  selector: "app-spec-card-list",
  templateUrl: "./spec-card-list.component.html",
})
export class SpecCardListComponent implements OnInit {
  @Input() asset: IAsset = {
    _id: "61d98c4ad8b20d468de4819f",
    laptop: {
      mem: {
        total: 8589934592,
      },
      memLayout: [
        {
          size: 4294967296,
          bank: "BANK 0",
          type: "DDR3",
          ecc: false,
          clockSpeed: 1600,
          manufacturer: "Elpida",
        },
        {
          size: 4294967296,
          bank: "BANK 1",
          type: "DDR3",
          ecc: false,
          clockSpeed: 1600,
          manufacturer: "Elpida",
        },
      ],
      diskLayout: [
        {
          device: "disk0",
          type: "NVMe",
          name: "",
          vendor: "",
          size: 128,
          _id: "61d98c4ad8b20d468de481a1",
        },
      ],
      cpu: {
        manufacturer: "Intel®",
        brand: "Intel® i7",
        processors: 1,
      },
    },
    type: "laptop",
  };

  diskLayout;
  mem;
  memLayout;
  constructor() {}

  ngOnInit(): void {
    //check the type of asset
  }

  getProcessorShortName(value: string) {
    if (value.includes("i3")) return "i3";
    else if (value.includes("i5")) return "i5";
    else if (value.includes("i7")) return "i7";
    else if (value.includes("i9")) return "i9";
    else return "N/A";
  }
}
