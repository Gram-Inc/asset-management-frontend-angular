import { Component, Input, OnInit } from "@angular/core";
import { IAsset } from "src/app/core/asset/asset.types";

@Component({
  selector: "app-spec-card-list",
  templateUrl: "./spec-card-list.component.html",
})
export class SpecCardListComponent implements OnInit {
  @Input() asset: IAsset;

  diskLayout;
  mem;
  memLayout;
  constructor() {}

  ngOnInit(): void {}
}
