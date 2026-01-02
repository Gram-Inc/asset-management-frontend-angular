import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AssetService } from 'src/app/core/asset/asset.service';
import { IAsset } from 'src/app/core/asset/asset.types';
import { TicketService } from 'src/app/core/ticket/ticket.service';
import { ITicket } from 'src/app/core/ticket/ticket.types';
import { BasicService } from 'src/app/core/basic/basic.service';
import { IBranch } from 'src/app/core/branch/branch.types';

@Component({
  selector: 'app-asset-full-detail',
  templateUrl: './asset-full-detail.component.html',
  styleUrls: ['./asset-full-detail.component.scss']
})
export class AssetFullDetailComponent implements OnInit, OnDestroy {
  asset: IAsset | null = null;
  tickets: ITicket[] = [];
  isLoading: boolean = true;
  isLoadingTickets: boolean = true;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _assetService: AssetService,
    private _ticketService: TicketService,
    private _basicService: BasicService
  ) { }

  ngOnInit(): void {
    this._route.params.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
      const assetId = params.id;
      if (assetId) {
        this.loadAssetDetails(assetId);
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  loadAssetDetails(assetId: string): void {
    this.isLoading = true;
    this._assetService.getAssetDetailsById(assetId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (asset) => {
          this.asset = asset;
          this.isLoading = false;
          // Load tickets after asset is loaded
          this.loadAssetTickets(assetId, asset.assetCode, this.getSerialNumber(asset));
        },
        error: (error) => {
          console.error('Error loading asset:', error);
          this.isLoading = false;
        }
      });
  }

  loadAssetTickets(assetId: string, assetCode?: string, serialNumber?: string): void {
    this.isLoadingTickets = true;
    this._assetService.getAssetTickets(assetId, assetCode, serialNumber)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (tickets) => {
          this.tickets = tickets || [];
          this.isLoadingTickets = false;
        },
        error: (error) => {
          console.error('Error loading tickets:', error);
          this.isLoadingTickets = false;
        }
      });
  }

  getSerialNumber(asset: IAsset): string | undefined {
    if (asset.type === 'laptop' || asset.type === 'pc' || asset.type === 'server') {
      return asset[asset.type]?.system?.serial;
    }
    return asset.sr_no;
  }

  getBranchName(branch: string | Partial<IBranch>): string {
    if (branch) return typeof branch === 'object' ? branch.name : '-';
    return 'N/A';
  }

  getBranchShortCode(branch: string | Partial<IBranch>): string {
    if (branch) return typeof branch === 'object' ? branch.branchCode : '-';
    return 'N/A';
  }

  getCurrentUser(asset: IAsset): string {
    if (asset.allocationToUserId && typeof asset.allocationToUserId === 'object') {
      if (asset.allocationToUserId.firstName?.toUpperCase() === asset.allocationToUserId.lastName?.toUpperCase()) {
        return asset.allocationToUserId.firstName || '-';
      }
      return `${asset.allocationToUserId.firstName || ''} ${asset.allocationToUserId.lastName || ''}`.trim() || '-';
    }
    return '-';
  }

  getPreviousUser(asset: IAsset): string {
    if (asset.perviousUser && typeof asset.perviousUser === 'object') {
      if (asset.perviousUser.firstName?.toUpperCase() === asset.perviousUser.lastName?.toUpperCase()) {
        return asset.perviousUser.firstName || '-';
      }
      return `${asset.perviousUser.firstName || ''} ${asset.perviousUser.lastName || ''}`.trim() || '-';
    }
    return '-';
  }

  getLogo(): string {
    if (!this.asset) return '';
    return this._basicService.getAppropriateBrandLogo(
      this.asset.laptop?.system?.model ?? this.asset.type ?? ''
    );
  }

  getProcessorLogo(): string {
    if (!this.asset?.laptop?.cpu?.brand) return '';
    return this._basicService.getAppropriateCPULogo(this.asset.laptop.cpu.brand);
  }

  formatDuration(days: number, hours: number, minutes: number): string {
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0 && days === 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'Less than a minute';
  }

  getTicketRequesterName(ticket: ITicket): string {
    if (ticket.requestFromUserId && typeof ticket.requestFromUserId === 'object' && ticket.requestFromUserId !== null) {
      const firstName = ticket.requestFromUserId.firstName || '';
      const lastName = ticket.requestFromUserId.lastName || '';
      if (firstName.toUpperCase() === lastName.toUpperCase()) {
        return firstName || '-';
      }
      return `${firstName} ${lastName}`.trim() || '-';
    }
    return '-';
  }

  getTicketAssignedToName(ticket: ITicket): string {
    if (ticket.assignedToUserId && typeof ticket.assignedToUserId === 'object' && ticket.assignedToUserId !== null) {
      const firstName = ticket.assignedToUserId.firstName || '';
      const lastName = ticket.assignedToUserId.lastName || '';
      if (firstName.toUpperCase() === lastName.toUpperCase()) {
        return firstName || '-';
      }
      return `${firstName} ${lastName}`.trim() || '-';
    }
    return '-';
  }

  openTicket(ticketId: string): void {
    this._router.navigate([`/ticket/${ticketId}`]);
  }

  goBack(): void {
    this._router.navigate(['/asset']);
  }

  isWarrantyValid(endAt: string | Date): boolean {
    if (!endAt) return false;
    return new Date(endAt) > new Date();
  }

  getWarrantyIcon(endAt: string | Date): string {
    return this.isWarrantyValid(endAt) ? 'heroicons_solid:badge-check' : 'heroicons_solid:x-circle';
  }
}
