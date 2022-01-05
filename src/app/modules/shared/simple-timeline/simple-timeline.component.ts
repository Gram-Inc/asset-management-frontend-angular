import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "simple-timeline",
  templateUrl: "./simple-timeline.component.html",
  styleUrls: ["./simple-timeline.component.scss"],
})
export class SimpleTimelineComponent implements OnInit {
  @Input() data: any;
  constructor() {}

  ngOnInit(): void {}

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
