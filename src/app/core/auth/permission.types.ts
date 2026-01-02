export enum ModuleTypes
{
    Asset = "ASSET",
    User = "USER",
    Branch = "BRANCH",
    Department = "DEPARTMENT",
    Report = "REPORT",
    UAM = "UAM",
    Ticket = "TICKET",
    Vendor = "VENDOR",
    Audit = "AUDIT"
}
export enum AccessType
{
    FullAccess = "Full",
    Read = "Read",
    ReadWrite = "Read / Write",
    NoAcess = "N/A"
}
export enum IUAMPermissions
{
    UAMNoCreate = "UAMNoCreate",
    UAMCreate = "UAMCreate",
    UAMView = "UAMView",
    UAMUpdate = "UAMUpdate",
    UAMDelete = "UAMDelete",
}

export enum IUserPermissions
{
    UAMNoCreate = "UAMNoCreate",
    UAMCreate = "UAMCreate",
    UAMView = "UAMView",
    UAMUpdate = "UAMUpdate",
    UAMDelete = "UAMDelete",
}

export enum IAssetPermissions
{
    AssetCreate = "AssetCreate",
    AssetView = "AssetView",
    AssetUpdate = "AssetUpdate",
    AssetDelete = "AssetDelete",
}

export enum ITicketPermissions
{
    TicketCreate = "TicketCreate",
    TicketView = "TicketView",
    TicketUpdate = "TicketUpdate",
    TicketDelete = "TicketDelete",
}

export enum IDepartmentPermissions
{
    DepartmentCreate = "DepartmentCreate",
    DepartmentView = "DepartmentView",
    DepartmentUpdate = "DepartmentUpdate",
    DepartmentDelete = "DepartmentDelete",
}
export enum IVendorPermissions
{
    VendorCreate = "VendorCreate",
    VendorView = "VendorView",
    VendorUpdate = "VendorUpdate",
    VendorDelete = "VendorDelete",
}
export enum IBranchPermissions
{
    BranchCreate = "BranchCreate",
    BranchView = "BranchView",
    BranchUpdate = "BranchUpdate",
    BranchDelete = "BranchDelete",
}

export enum IAuditPermissions
{
    AuditCreate = "AuditCreate",
    AuditView = "AuditView",
    AuditUpdate = "AuditUpdate",
    AuditDelete = "AuditDelete",
}
