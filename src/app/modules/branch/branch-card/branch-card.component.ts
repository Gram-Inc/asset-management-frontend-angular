import { Component, Input, OnInit } from "@angular/core";
import { IBranch } from "src/app/core/branch/branch.types";

@Component({
  selector: "app-branch-card",
  templateUrl: "./branch-card.component.html",
  styleUrls: ["./branch-card.component.scss"],
})
export class BranchCardComponent implements OnInit {
  @Input() branch: IBranch;

  constructor() {}

  ngOnInit(): void {}
}
