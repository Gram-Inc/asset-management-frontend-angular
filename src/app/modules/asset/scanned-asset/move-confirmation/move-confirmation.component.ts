import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-move-confirmation",
  templateUrl: "./move-confirmation.component.html",
  styleUrls: ["./move-confirmation.component.scss"],
})
export class MoveConfirmationComponent implements OnInit {
  type: string = "";
  constructor(public dialogRef: MatDialogRef<MoveConfirmationComponent>) {}

  ngOnInit(): void {}
}
