import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  @Input() icon: any;
  @Input() title: any;
  @Input() value: any;
  constructor() {}

  ngOnInit(): void {}
}
