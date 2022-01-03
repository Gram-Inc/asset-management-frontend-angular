import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-spec-card",
  templateUrl: "./spec-card.component.html",
  styleUrls: ["./spec-card.component.scss"],
})
export class SpecCardComponent implements OnInit {
  type: "HDD" | "SSD" | "NVMe" | "RAM" = "SSD";
  size = "1000";
  constructor() {}

  ngOnInit(): void {}
}
