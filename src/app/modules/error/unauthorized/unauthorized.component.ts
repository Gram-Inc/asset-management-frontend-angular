import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/core/loading/loading.service';

@Component({
   selector: 'app-unauthorized',
   templateUrl: './unauthorized.component.html',
   styleUrls: ['./unauthorized.component.scss']
})
export class UnauthorizedComponent implements OnInit
{

   constructor(private _loadingService: LoadingService, private _snackBar: MatSnackBar, private _router: Router)
   {
      this._snackBar.open(`You're not authorised to access this area !`)._dismissAfter(4000);
      this._router.navigate(['dashboard']);
   }

   ngOnInit(): void
   {

   }

}
