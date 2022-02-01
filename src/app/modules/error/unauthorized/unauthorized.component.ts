import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/loading/loading.service';

@Component({
    selector: 'app-unauthorized',
    templateUrl: './unauthorized.component.html',
    styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit
{

    constructor(private _loadingService: LoadingService) { }

    ngOnInit(): void
    {
    }

}
