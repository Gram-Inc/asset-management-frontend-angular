import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import { AllocationStatus, ITimeline, TimelineEventType } from "src/app/core/asset/asset.types";

@Component({
  selector: "app-asset-timeline",
  templateUrl: "./asset-timeline.component.html",
  styleUrls: ["./asset-timeline.component.scss"],
})
export class AssetTimelineComponent implements OnInit {
  @Input() data: ITimeline[] = [];

  TimelineEventType = TimelineEventType;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  isSameDay(current: number, compare: number): boolean {
    return moment(current).isSame(moment(compare), "day");
  }
  getRelativeFormat(date: string): string {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "day").startOf("day");

    // Is today?
    if (moment(date, moment.ISO_8601).isSame(today, "day")) {
      return "Today";
    }

    // Is yesterday?
    if (moment(date, moment.ISO_8601).isSame(yesterday, "day")) {
      return "Yesterday";
    }

    return moment(date, moment.ISO_8601).fromNow();
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  getActivityIconData(activity: ITimeline) {
    // Check event type first
    if (activity.eventType === TimelineEventType.ASSET_CREATED) {
      return "heroicons_outline:plus-circle";
    }
    if (activity.eventType === TimelineEventType.TICKET_CREATED) {
      return "heroicons_outline:document-text";
    }
    if (activity.eventType === TimelineEventType.ASSIGNED_TO_USER) {
      return "heroicons_outline:user-add";
    }
    if (activity.eventType === TimelineEventType.MOVED_TO_REPAIR) {
      return "heroicons_outline:wrench-screwdriver";
    }
    if (activity.eventType === TimelineEventType.RETURNED_TO_POOL) {
      return "heroicons_outline:arrow-left";
    }

    // Fallback to status-based icons
    let v = "heroicons_outline:code";
    switch (activity.x) {
      case AllocationStatus.ASSIGNED:
        v = "heroicons_outline:badge-check";
        break;
      case AllocationStatus.IN_POOL:
        v = "heroicons_outline:office-building";
        break;
      case AllocationStatus.DOWN:
        v = "heroicons_outline:exclamation-circle";
        break;
      case AllocationStatus.SCRAP:
        v = "heroicons_outline:x-circle";
        break;
      default:
        break;
    }
    return v;
  }

  getEventTypeColor(eventType: string): string {
    switch (eventType) {
      case TimelineEventType.ASSET_CREATED:
        return 'bg-green-100 text-green-600';
      case TimelineEventType.TICKET_CREATED:
        return 'bg-purple-100 text-purple-600';
      case TimelineEventType.ASSIGNED_TO_USER:
        return 'bg-blue-100 text-blue-600';
      case TimelineEventType.MOVED_TO_REPAIR:
        return 'bg-yellow-100 text-yellow-600';
      case TimelineEventType.RETURNED_TO_POOL:
        return 'bg-orange-100 text-orange-600';
      case TimelineEventType.STATUS_CHANGE:
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case AllocationStatus.ASSIGNED:
        return 'bg-blue-100 text-blue-600';
      case AllocationStatus.IN_POOL:
        return 'bg-orange-100 text-orange-600';
      case AllocationStatus.DOWN:
        return 'bg-yellow-100 text-yellow-600';
      case AllocationStatus.SCRAP:
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  formatDuration(days: number, hours: number, minutes: number): string {
    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0 && days === 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
    return parts.length > 0 ? parts.join(', ') : 'Less than a minute';
  }

  getUserName(activity: ITimeline): string {
    if (activity.firstName && activity.lastName) {
      if (activity.firstName.toUpperCase() === activity.lastName.toUpperCase()) {
        return activity.firstName;
      }
      return `${activity.firstName} ${activity.lastName}`;
    }
    return '';
  }

  openTicket(ticketId: string): void {
    if (ticketId) {
      this.router.navigate([`/ticket/${ticketId}`]);
    }
  }

  getEventDescription(activity: ITimeline): string {
    if (activity.description) {
      return activity.description;
    }
    if (activity.eventType === TimelineEventType.ASSET_CREATED) {
      return 'Asset Created';
    }
    if (activity.eventType === TimelineEventType.TICKET_CREATED) {
      return activity.ticketSubject || 'Ticket Created';
    }
    if (activity.x) {
      return activity.x.toString().replace('_', ' ');
    }
    return 'Event';
  }

  formatEventType(eventType: string): string {
    if (!eventType) return '';
    return eventType.replace(/_/g, ' ');
  }

  formatStatus(status: string): string {
    if (!status) return '';
    return status.replace(/_/g, ' ');
  }
}
