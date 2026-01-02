import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuditService } from "src/app/core/audit/audit.service";
import { ICreateAuditDto } from "src/app/core/audit/audit.types";
import { BranchService } from "src/app/core/branch/branch.service";
import { DepartmentService } from "src/app/core/department/department.service";
import { UserService } from "src/app/core/user/user.service";
import { IBranch } from "src/app/core/branch/branch.types";
import { IDepartment } from "src/app/core/department/department.types";
import { IUser } from "src/app/core/user/user.types";

@Component({
  selector: "app-create-audit",
  templateUrl: "./create.component.html",
  styleUrls: ["./create.component.scss"],
})
export class CreateAuditComponent implements OnInit {
  auditForm: UntypedFormGroup;
  branches: IBranch[] = [];
  departments: IDepartment[] = [];
  level2Users: IUser[] = [];
  includeAllAssets: boolean = true;
  selectedAssets: string[] = [];

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _auditService: AuditService,
    private _branchService: BranchService,
    private _departmentService: DepartmentService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    public router: Router
  ) {
    this.auditForm = this._formBuilder.group({
      name: ["", Validators.required],
      branchId: ["", Validators.required],
      departmentIds: [[], Validators.required],
      assignedToUserId: [""],
    });
  }

  ngOnInit(): void {
    // Load data from services directly (more reliable with lazy-loaded modules)
    this._branchService.getBranchs().subscribe((res) => {
      this.branches = res.data || [];
    });

    this._departmentService.getDepartments().subscribe((res) => {
      this.departments = res.data || [];
    });

    this._userService.getUsers().subscribe((res) => {
      this.level2Users = (res.data || []).filter(
        (u: IUser) => u.role === "level2"
      );
    });
  }

  onSubmit(): void {
    this.auditForm.markAllAsTouched();
    if (this.auditForm.invalid) return;

    const formValue = this.auditForm.value;
    const auditDto: ICreateAuditDto = {
      name: formValue.name,
      branchId: formValue.branchId,
      departmentIds: Array.isArray(formValue.departmentIds)
        ? formValue.departmentIds
        : [formValue.departmentIds],
      assignedToUserId: formValue.assignedToUserId || undefined,
      assetIds: this.includeAllAssets ? undefined : this.selectedAssets,
    };

    this._auditService.createAudit(auditDto).subscribe({
      next: (audit) => {
        this.openSnackBar("Success", "Audit created successfully");
        this.router.navigate(["/audit"]);
      },
      error: (err) => {
        console.error("Error creating audit:", err);
        this.openSnackBar("Error", err.error?.message || "Failed to create audit. Please try again.");
      },
    });
  }

  openSnackBar(type: "Error" | "Info" | "Success", msg: string) {
    this._snackBar.open(msg, "Close", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "center",
      panelClass: type == "Error" ? "text-red-500" : type == "Info" ? "text-blue-500" : "text-green-500",
    });
  }

  toggleAssetSelection(): void {
    this.includeAllAssets = !this.includeAllAssets;
    if (this.includeAllAssets) {
      this.selectedAssets = [];
    }
  }
}
