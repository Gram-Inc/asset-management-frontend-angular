import { Component, Input, OnInit } from "@angular/core";
import { IBranch } from "src/app/core/branch/branch.types";

@Component({
  selector: "app-branch-create",
  templateUrl: "./branch-create.component.html",
  styleUrls: ["./branch-create.component.scss"],
})
export class BranchCreateComponent implements OnInit {
  @Input() branch: IBranch;
  constructor() {}

  ngOnInit(): void {}
}
