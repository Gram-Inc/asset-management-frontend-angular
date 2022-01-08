import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "title-card",
  templateUrl: "./title-card.component.html",
  styleUrls: ["./title-card.component.scss"],
})
export class TitleCardComponent implements OnInit {
  @Input() icon: any;
  @Input() title: any;
  @Input() value: any;
  @Input() bgColor: any;
  @Input() color: any;
  constructor() {}

  ngOnInit(): void {}
}
