import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable } from "rxjs/internal/Observable";
import { UntypedFormControl } from "@angular/forms";
@Component({
  selector: "app-asset-filter",
  templateUrl: "./asset-filter.component.html",
  styleUrls: ["./asset-filter.component.scss"],
})
export class AssetFilterComponent implements OnInit {
  removableFilter = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredFilters: Observable<string[]>;
  allDepartments: string[] = []; //Get All warehouse from registered Warehouse
  filters: string[] = [];

  @ViewChild("filterInput", { static: false })
  departmentInput: ElementRef<HTMLInputElement>;

  filterCtrl: UntypedFormControl = new UntypedFormControl("");
  constructor() {}

  ngOnInit(): void {}

  removeFilter(department: string): void {
    const index = this.filters.indexOf(department);

    if (index >= 0) {
      this.filters.splice(index, 1);
    }
  }

  selectedFilter(event: MatAutocompleteSelectedEvent): void {
    if (this.filters.includes(event.option.viewValue)) return;
    this.filters.push(event.option.viewValue);
    this.departmentInput.nativeElement.value = "";
  }
}
