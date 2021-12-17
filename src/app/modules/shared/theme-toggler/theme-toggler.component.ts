import { OverlayContainer } from "@angular/cdk/overlay";
import { Component, HostBinding, OnInit } from "@angular/core";

@Component({
  selector: "app-theme-toggler",
  templateUrl: "./theme-toggler.component.html",
})
export class ThemeTogglerComponent {
  constructor(public overlayContainer: OverlayContainer) {}
  @HostBinding("class") componentCssClass;

  onSetTheme(theme) {
    this.overlayContainer.getContainerElement().classList.add(theme);
    this.componentCssClass = theme;
  }
}
