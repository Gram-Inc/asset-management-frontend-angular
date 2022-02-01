import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { IPermissions } from '../user/user.types';
import { AccessType, ModuleTypes } from './permission.types';

@Injectable({
   providedIn: 'root',
})
export class PermissionService
{
   permssions = [
      "UAMNoCreate",
      "UAMCreate",
      "UAMView",
      "UAMUpdate",
      "UAMDelete",
      "TicketCreate",
      "TicketView",
      "TicketUpdate",
      "TicketDelete",
      "DepartmentCreate",
      "DepartmentView",
      "DepartmentUpdate",
      "DepartmentDelete",
      "BranchCreate",
      "BranchView",
      "BranchUpdate",
      "BranchDelete",
      "AssetCreate",
      "AssetView",
      "AssetUpdate",
      "AssetDelete",
      "VendorCreate",
      "VendorView",
      "VendorUpdate",
      "VendorDelete",
      "UserCreate",
      "UserView",
      "UserUpdate",
      "UserDelete"
   ];
   constructor(private _userService: UserService) { }

   // Check Current

   checkPermission(policies: string[] = [], moduleName: ModuleTypes): AccessType
   {
      // Get All accessType by policy name
      let accType = this.filterPolicyByModule(policies, moduleName);
      if (
         this.arrContaints(accType, 'CREATE') &&
         this.arrContaints(accType, 'UPDATE') &&
         this.arrContaints(accType, 'VIEW') &&
         this.arrContaints(accType, 'DELETE'))

         return AccessType.FullAccess;

      if (
         this.arrContaints(accType, 'CREATE') &&
         this.arrContaints(accType, 'UPDATE') &&
         this.arrContaints(accType, 'VIEW'))

         return AccessType.ReadWrite;

      if (
         this.arrContaints(accType, 'VIEW'))

         return AccessType.Read;

      return AccessType.NoAcess;

   }

   checkCurrentUserPermission(moduleName: ModuleTypes): Observable<AccessType>
   {
      return this._userService.user$.pipe(
         switchMap(user =>
         {
            // Get All accessType by policy name
            let accType = this.filterPolicyByModule(user.permissions, moduleName);
            if (
               this.arrContaints(accType, 'CREATE') &&
               this.arrContaints(accType, 'UPDATE') &&
               this.arrContaints(accType, 'VIEW') &&
               this.arrContaints(accType, 'DELETE'))

               return of(AccessType.FullAccess);

            if (
               this.arrContaints(accType, 'CREATE') &&
               this.arrContaints(accType, 'UPDATE') &&
               this.arrContaints(accType, 'VIEW'))

               return of(AccessType.ReadWrite);

            if (
               this.arrContaints(accType, 'VIEW'))

               return of(AccessType.Read);

            return of(AccessType.NoAcess);
         })
      )
   }
   private getAllPermissionByModule(moduleName: ModuleTypes): string[]
   {
      return [...this.permssions.filter(x => x.toUpperCase().includes(moduleName))]
   }

   private filterPolicyByModule(policies: string[], moduleName: ModuleTypes)
   {
      return policies.filter(x => x.toUpperCase().includes(moduleName));
   }

   getArrOfPolicyByAccessType(moduleName: ModuleTypes, accessType: AccessType)
   {
      //Get Permission Arr By Module
      let per = this.getAllPermissionByModule(moduleName);
      switch (accessType)
      {
         case AccessType.FullAccess:
            return per;
         case AccessType.Read:
            return per.filter((x) => x.toUpperCase().includes('VIEW'))
         case AccessType.ReadWrite:
            return per.filter((x) => x.toUpperCase().includes('UPDATE') || x.toUpperCase().includes('CREATE') || x.toUpperCase().includes('VIEW'))
         default:
            new Error("Access Type not defined");
            return [];
      }

   }

   private arrContaints(arr: string[], search: string)
   {
      if (arr.findIndex((x) => x.toUpperCase().includes(search.toUpperCase())) == -1) return false;
      return true;
   }
}
