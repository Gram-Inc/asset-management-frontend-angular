import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";
import { AllocationStatus, ITimeline } from "src/app/core/asset/asset.types";

@Component({
  selector: "app-asset-timeline",
  templateUrl: "./asset-timeline.component.html",
  styleUrls: ["./asset-timeline.component.scss"],
})
export class AssetTimelineComponent implements OnInit {
  @Input() data: ITimeline[] = [
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641187948202, 1641352646953],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641352646953, 1641355643012],
      _id: "619b85cde7049da912a951ba",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641355643012, 1641355761931],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641355761931, 1641355786950],
      _id: "",
    },
    {
      x: AllocationStatus.DOWN,
      y: [1641355786950, 1641356212311],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641356212311, 1641356260554],
      _id: "",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641356260554, 1641356267659],
      _id: "",
    },
    {
      x: AllocationStatus.DOWN,
      y: [1641356267659, 1641356349460],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641356349460, 1641356376018],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641356376018, 1641356461126],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641356461126, 1641356735726],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641356735726, 1641359695658],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641359695658, 1641359709563],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641359709563, 1641359770071],
      _id: "",
    },
    {
      x: AllocationStatus.DOWN,
      y: [1641359770071, 1641359971614],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641359971614, 1641360043619],
      _id: "",
    },
    {
      x: AllocationStatus.DOWN,
      y: [1641360043619, 1641360176355],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641360176355, 1641360179439],
      _id: "",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641360179439, 1641360193697],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641360193697, 1641360375333],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641360375333, 1641360380555],
      _id: "",
    },
    {
      x: AllocationStatus.SCRAP,
      y: [1641360380555, 1641360384624],
      _id: "",
    },
    {
      x: AllocationStatus.DOWN,
      y: [1641360384624, 1641360398175],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641360398175, 1641361090300],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.IN_POOL,
      y: [1641361090300, 1641361098500],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641361098500, 1641361173342],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641361173342, 1641361580924],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641361580924, 1641365587627],
      _id: "619b85cde7049da912a951ba",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641365587627, 1641365597816],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.DOWN,
      y: [1641365597816, 1641384286382],
      _id: "",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641384286382, 1641485352351],
      _id: "61d2b13ac142d96ac3c9398f",
    },
    {
      x: AllocationStatus.ASSIGNED,
      y: [1641485352351, 1641544271930],
      _id: "619b85cde7049da912a951ba",
    },
  ];
  constructor() {}

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
}
