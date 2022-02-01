import { Component, Input, OnInit } from '@angular/core';
import { AccessType } from 'src/app/core/auth/permission.types';

@Component({
    selector: 'app-access-pill',
    templateUrl: './access-pill.component.html',
    styleUrls: ['./access-pill.component.scss']
})
export class AccessPillComponent implements OnInit
{
    accessTypes = AccessType;
    @Input() data: AccessType = AccessType.NoAcess;
    constructor() { }

    ngOnInit(): void
    {
    }

}
