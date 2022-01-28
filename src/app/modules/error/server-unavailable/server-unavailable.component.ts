import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/core/loading/loading.service';

@Component({
    selector: 'app-server-unavailable',
    templateUrl: './server-unavailable.component.html',
    styleUrls: ['./server-unavailable.component.scss']
})
export class ServerUnavailableComponent implements OnInit
{

    constructor(private _loadingService: LoadingService) { }

    ngOnInit(): void
    {
    }

}
