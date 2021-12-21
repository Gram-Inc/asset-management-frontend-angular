import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { BranchService } from "src/app/core/branch/branch.service";
import { IBranch } from "src/app/core/branch/branch.types";

@Component({
  selector: "app-branch",
  templateUrl: "./branch.component.html",
  styleUrls: ["./branch.component.scss"],
})
export class BranchComponent implements OnInit {
  branchs$: Observable<IBranch[]> = new Observable<IBranch[]>();
  constructor(private _branchService: BranchService) {}

  ngOnInit(): void {
    this.branchs$ = this._branchService.branchs$;
  }
}
