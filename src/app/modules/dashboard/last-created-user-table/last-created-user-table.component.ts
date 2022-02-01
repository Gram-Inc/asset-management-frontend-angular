import { Component, Input, OnInit } from "@angular/core";
import { IAssetDashboard } from "src/app/core/dashboard/dashboard.types";

@Component({
    selector: "last-created-user-table",
    templateUrl: "./last-created-user-table.component.html",
})
export class LastCreatedUserTableComponent implements OnInit
{
    @Input() data: IAssetDashboard;
    constructor() { }

    ngOnInit(): void { }

    /**
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
}
