import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-uam-detail",
  templateUrl: "./uam-detail.component.html",
  styleUrls: ["./uam-detail.component.scss"],
})
export class UamDetailComponent implements OnInit {
  requestType: "c" | "m" | "d" | "de" = "m";
  noOfUser: "single" | "multiple" = "single";
  constructor() {}

  ngOnInit(): void {}
}
