import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styles: [
    /* language=SCSS */
    `
      .fuse-confirmation-dialog-panel {
        @screen md {
          @apply w-128;
        }

        .mat-dialog-container {
          padding: 0 !important;
        }
      }
    `,
  ],
})
export class DetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<DetailsComponent>
  ) {}

  ngOnInit(): void {}
}
