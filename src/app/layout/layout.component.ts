import { Component, OnInit } from "@angular/core";
import { User } from "../core/user/user.types";

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"],
})
export class LayoutComponent implements OnInit {
  user: User = { id: "Test", email: "Gram", name: "Govind", status: "online" };
  constructor() {}

  ngOnInit(): void {}
}
